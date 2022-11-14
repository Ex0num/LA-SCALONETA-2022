import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Servicios/auth.service';
import { FirebaseService } from 'src/app/Servicios/firebase.service';
import { ScannerQrService } from 'src/app/Servicios/scanner-qr.service';
import { SonidosPersonalizadosService } from 'src/app/Servicios/sonidos-personalizados.service';
import { ToastMsgService } from 'src/app/Servicios/toast-msg.service';

@Component({
  selector: 'app-clientes-esperando-pedido',
  templateUrl: './clientes-esperando-pedido.component.html',
  styleUrls: ['./clientes-esperando-pedido.component.scss'],
})
export class ClientesEsperandoPedidoComponent implements OnInit {

  constructor(
    public srvLectorQR:ScannerQrService,
    public srvToast:ToastMsgService, 
    public srvSonidos:SonidosPersonalizadosService,
    public srvFirebase:FirebaseService,
    public srvAuth:AuthService,
    public router:Router
  ) 
  {
    //Me traigo los consumidores y me suscribo a la db cosa de actualizarlo en tiempo real al consumidor actual
    this.srvFirebase.listar_consumidores().subscribe((data)=>
    {
      this.arrayConsumidores = data;
      console.log(this.arrayConsumidores); 
      
      //Los recorro. 
      data.forEach( (consumidor) => 
      {
        //Si el consumidor actual ya fue cargado voy a reemplazar sus datos xq la actualizacion de la db podria pertenecerle
        if (this.consumidorActual != undefined && this.consumidorActual.nombre == consumidor.nombre && this.consumidorActual.id == consumidor.id)
        { 
          console.log("Actualizando data del consumidor actual...");
          this.consumidorActual = consumidor;

          //Si la actualizacion es que ya fue asignado a una mesa y paso de "esperando_mesa" a "escaneando_mesa", lo llevamos al siguiente nivel
          // if (this.consumidorActual.estado == 'escaneando_mesa') {this.router.navigateByUrl("mesa-home")}
        }
      });
    });

    //Me traigo los pedidos y me suscribo a la db cosa de actualizarlo en tiempo real al pedido actual
    this.srvFirebase.listar_pedidos().subscribe((data)=>
    {
      this.arrayPedidos = data;
      console.log(this.arrayPedidos); 
      
      //Los recorro. 
      data.forEach( (pedido) => 
      {
        //Si el pedido actual ya fue cargado voy a reemplazar sus datos xq la actualizacion de la db podria pertenecerle
        if (this.pedidoDelConsumidorActual != undefined && this.pedidoDelConsumidorActual.consumidor == pedido.consumidor && this.pedidoDelConsumidorActual.id == pedido.id)
        { 
          console.log("Actualizando data del pedido actual...");
          this.pedidoDelConsumidorActual = pedido;

          //Si la actualizacion es que ya fue asignado a una mesa y paso de "esperando_mesa" a "escaneando_mesa", lo llevamos al siguiente nivel
          //if (this.consumidorActual.estado == 'escaneando_mesa') {this.router.navigateByUrl("mesa-home")}
        }
      });
    });
  }

  ngOnInit() 
  {
    setTimeout(() => 
    {
      this.detectarUsuarioActual();
      let pedidoDelConsumidorActualDetectado;

      if (this.srvAuth.nombreDelAnonimo != undefined)
      {
        console.log("Buscando pedido by name anon");
        pedidoDelConsumidorActualDetectado = this.buscarPedidoConsumidor(this.consumidorActual.nombre);  //Es anon
      }
      else
      {
        console.log("Buscando pedido by mail loged");
        pedidoDelConsumidorActualDetectado = this.buscarPedidoConsumidor(this.srvAuth.userLogedData.email);  //Es loged
      }
             
      this.pedidoDelConsumidorActual = pedidoDelConsumidorActualDetectado;
   
    }, 1500);

    setTimeout(() => 
    {
      this.cargaDeConsumidorTerminada = true;
      console.log("CARGA TERMINADA");
      console.log(this.consumidorActual);
      console.log(this.pedidoDelConsumidorActual);
    }, 3800);
  }

  //#region ------------------------ Atributos ----------------------------
  public sonidoActivado:boolean = true;
  
  arrayConsumidores:any = [];
  consumidorActual:any;
  
  arrayPedidos:any = [];
  pedidoDelConsumidorActual:any;
  
  cargaDeConsumidorTerminada = false;
  mesaEscaneadaSatisfactoriamente = false;
  
  // ------------ Encuestas ----------------

  mostrarEncuesta = false;
  mostrarResultadosEncuestas = false;

  switchearMostrarEncuestaPersonal()
  {

    if (this.mostrarEncuesta == false)
    {   
      //Muestro encuesta
      this.mostrarEncuesta = true;
    }
    else
    {
      //Oculto encuesta
      this.mostrarEncuesta = false;

    }
  }
  
  enviarEncuesta()
  {
    if (this.srvAuth.encuestaEnviada == false)
    {
      // --
      let opcionesPrecios:any = document.querySelectorAll('input[name="precioAcordes"]');
      let preciosAcordesRta;         
      
      if (opcionesPrecios[0]["checked"] == true) //Se tildo si
      {
        preciosAcordesRta = "Si";
      }
      else if (opcionesPrecios[1]["checked"] == true) //Se tildo no
      {;
        preciosAcordesRta = "No";
      }
      // --
      let opcionesAtencion:any = document.querySelectorAll('input[name="atencionEmpleados"]');
      let atencionBuenaRta;         
      
      if (opcionesAtencion[0]["checked"] == true) //Se tildo si
      {
        atencionBuenaRta = "Si";
      }
      else if (opcionesAtencion[1]["checked"] == true) //Se tildo no
      {;
        atencionBuenaRta = "No";
      }
      // --
      let opcionesComida:any = document.querySelectorAll('input[name="comidaRica"]');
      let comidaRicaRta;         
      
      if (opcionesComida[0]["checked"] == true) //Se tildo si
      {
        comidaRicaRta = "Si";
      }
      else if (opcionesComida[1]["checked"] == true) //Se tildo no
      {;
        comidaRicaRta = "No";
      }
      // --

      this.srvFirebase.alta_encuesta(comidaRicaRta,atencionBuenaRta,preciosAcordesRta);

      this.srvToast.mostrarToast("top","Encuesta enviada correctamente. ¡Gracias por tu opinión!",3000,"success");
      this.srvSonidos.reproducirSonido("bubble",this.sonidoActivado);

      //Oculto encuesta
      this.mostrarEncuesta = false;

      //Me guardo que el tipo ya envio la encuesta
      this.srvAuth.encuestaEnviada = true;
    }
    else
    {
      this.srvToast.mostrarToast("top","No se puede enviar más de una encuesta por estadía",3000,"danger");
      this.srvSonidos.reproducirSonido("error",this.sonidoActivado);
    }
  }

  switchearMostrarResultadosEncuestas()
  {
    let graficosEncuestas = document.getElementById("graphs-resultados-encuestas");
    
    if (this.mostrarResultadosEncuestas == false)
    {
      this.mostrarResultadosEncuestas = true;

      //Asigno animacion de entrada a los graphs  
      graficosEncuestas.style.animation = "slide-in-elliptic-bottom-fwd 0.7s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;";
    }
    else
    {
      this.mostrarResultadosEncuestas = false;

      //Asigno animacion de salida a los graphs
      graficosEncuestas.style.animation = "slide-out-bottom 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;";
    }
  }

  // ------------------------------------------

  // ------------- Funcionamiento de sonido ----------------------//
  public switchearEstadoSonido()
  {
    this.sonidoActivado = !this.sonidoActivado;
    let iconoSonido = document.getElementById("icono-sonido-altaAutoridad");
    
    if (this.sonidoActivado == true)
    {
      iconoSonido.setAttribute("name","volume-mute");
    }
    else
    {
      iconoSonido.setAttribute("name","radio");
    }
  }
  //-------------------------------------------------------------
 
  public escenarQR_Mesa()
  {
    //Leo el QR y el contenido devuelto lo cargo al formulario.
    this.srvLectorQR.openScan().then((stringObtenido)=>
    {
      let contenidoLeido = stringObtenido;

      //Detengo el scanner.
      this.srvLectorQR.stopScan();

      if (contenidoLeido == this.consumidorActual.mesaAsignada)
      {
        this.srvToast.mostrarToast("bottom","El QR pertenece a su mesa. ¡Genial!...",2500,"success");
        this.srvSonidos.reproducirSonido("bubble", this.sonidoActivado);
        
        this.mesaEscaneadaSatisfactoriamente = true;
      }
      else
      {
        this.srvToast.mostrarToast("bottom","El QR analizado no corresponde a su mesa asignada.",2500,"danger");
        this.srvSonidos.reproducirSonido("error", this.sonidoActivado);
      }
    });
  }

  public testing()
  {
    //Leo el QR y el contenido devuelto lo cargo al formulario.
    //this.srvLectorQR.openScan().then((stringObtenido)=>
    //{
      //let contenidoLeido = stringObtenido;
      let contenidoLeido = this.consumidorActual.mesaAsignada;
      //Detengo el scanner.
      //this.srvLectorQR.stopScan();

      if (contenidoLeido == this.consumidorActual.mesaAsignada)
      {
        this.srvToast.mostrarToast("bottom","El QR pertenece a su mesa. ¡Genial!...",2500,"success");
        this.srvSonidos.reproducirSonido("bubble", this.sonidoActivado);
        
        this.mesaEscaneadaSatisfactoriamente = true;
      }
      else
      {
        this.srvToast.mostrarToast("bottom","El QR analizado no corresponde a su mesa asignada.",2500,"danger");
        this.srvSonidos.reproducirSonido("error", this.sonidoActivado);
      }
    //});
  }

  detectarUsuarioActual()
  {
    //Si la sesion es anonima el alta del consumidor se hace con el nombre del anonimo
    if (this.srvAuth.nombreDelAnonimo != undefined)
    {
      console.log("El usuario actual es ANONIMO");
      console.log(this.srvAuth.nombreDelAnonimo);

      this.arrayConsumidores.forEach(consumidor =>
      {
          if (consumidor.nombre == this.srvAuth.nombreDelAnonimo)
          {
            console.log("Consumidor actual cargado!");
            this.consumidorActual = consumidor;
            this.cargaDeConsumidorTerminada = true;
          }
      });

    }
    else
    {
      //Si no, el alta del consumidor se hace con el mail del logeado
      let mailLogeado; 

      this.srvAuth.afAuth.user.subscribe((data) => 
      {
        mailLogeado = data.email;

        console.log("El usuario actual es REGISTRADO");
        console.log(mailLogeado);

        this.arrayConsumidores.forEach(consumidor =>
        {
            if (consumidor.nombre == mailLogeado)
            {
              console.log("Consumidor actual cargado!");
              this.consumidorActual = consumidor;
              this.cargaDeConsumidorTerminada = true;
            }
        });

      });
     
    }

    this.cargaDeConsumidorTerminada = true;
  }

  buscarPedidoConsumidor(nombreConsumidor:string)
  {
    let pedidoActual;

    this.arrayPedidos.forEach(pedido => 
    {
      //Obviamente me traigo al pedido que COINCIDA con el consumidor y que OBVIO no haya finalizado (xq puede no ser la primera vez del consumidor en el restobar)
      if (pedido.consumidor == nombreConsumidor && pedido.estado != 'finalizado')
      {
        pedidoActual = pedido;
      }
    });

    return pedidoActual;
  }

  confirmarEntrega()
  {
    //Cuando confirma la entrega del pedido, se cambian ambos estados
    this.pedidoDelConsumidorActual.estado = 'pago_pendiente';
    this.consumidorActual.estado = 'comiendo';

    this.srvFirebase.modificar_pedido(this.pedidoDelConsumidorActual, this.pedidoDelConsumidorActual.id);
    this.srvFirebase.modificar_consumidor(this.consumidorActual, this.consumidorActual.id);
  }

  pedirLaCuenta()
  {
    //Cuando confirma la entrega del pedido, se cambian ambos estados
    this.pedidoDelConsumidorActual.estado = 'pago_solicitado';
    this.consumidorActual.estado = 'pagando';

    this.srvFirebase.modificar_pedido(this.pedidoDelConsumidorActual, this.pedidoDelConsumidorActual.id);
    this.srvFirebase.modificar_consumidor(this.consumidorActual, this.consumidorActual.id);

    this.router.navigateByUrl('cuenta-generada');
  }

  juegos()
  {
    // this.router.navigateByUrl("cliente-juegos");
  }

}
