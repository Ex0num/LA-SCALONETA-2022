import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Servicios/auth.service';
import { FirebaseService } from 'src/app/Servicios/firebase.service';
import { ScannerQrService } from 'src/app/Servicios/scanner-qr.service';
import { SonidosPersonalizadosService } from 'src/app/Servicios/sonidos-personalizados.service';
import { ToastMsgService } from 'src/app/Servicios/toast-msg.service';

@Component({
  selector: 'app-cuenta-generada',
  templateUrl: './cuenta-generada.component.html',
  styleUrls: ['./cuenta-generada.component.scss'],
})
export class CuentaGeneradaComponent implements OnInit {

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
      data.forEach( (element) => 
      {
        //Si el consumidor actual ya fue cargado voy a reemplazar sus datos xq la actualizacion de la db podria pertenecerle
        if (this.consumidorActual != undefined && this.consumidorActual.nombre == element.nombre && element.estado != 'retirado')
        { 
          console.log("Actualizando data del consumidor actual...");
          this.consumidorActual = element;
          console.log(this.consumidorActual);
        }
      })
    });

    //Me traigo los pedidos y me suscribo a la db cosa de actualizarlo en tiempo real
    this.srvFirebase.listar_pedidos().subscribe((data)=>
    {
      this.arrayPedidos = data;
      console.log(this.arrayPedidos); 
      
      //Los recorro. 
      data.forEach( (pedido) => 
      {
        //Si el pedido actual ya fue cargado voy a reemplazar sus datos xq la actualizacion de la db podria pertenecerle
        if (this.consumidorActual != undefined && this.consumidorActual.nombre == pedido.consumidor && pedido.id == this.pedidoActual.id)
        { 
          console.log("Actualizando data del pedido actual...");
          this.pedidoActual = pedido;
          console.log(this.pedidoActual);

          if(pedido.estado == 'finalizado' && pedido.id == this.pedidoActual.id)
          {
            this.srvAuth.encuestaEnviada = false;
            this.srvAuth.nombreDelAnonimo = undefined;
            this.srvAuth.pedidoEnviado = false;
            this.srvAuth.tipoUserloged = undefined;
            
            // if (this.flagNavigateLoging == true)
            // {
            //   this.flagNavigateLoging = false;
            //   this.srvToast.mostrarToast("top","Fuiste redirigido al menú de inicio. ¡Muchas gracias por habernos elegido!",4000,"success");
            //   this.srvSonidos.reproducirSonido("cambio-pag", this.sonidoActivado);
      
            //   this.srvAuth.logOut(false);
            //   this.router.navigateByUrl("login");
            // }
          }
        }
      });

    });

    //Me traigo los productos
    this.srvFirebase.listar_productos().subscribe((data)=>
    {
      this.arrayProductos = data;
      console.log(this.arrayProductos); 
    });
  }

  ngOnInit() 
  {
    setTimeout(() => 
    {
      //Me fijo quien es el consumidor actual y su pedido
      this.detectarUsuarioYPedidoActual();

      console.log("Consumidor actual");
      console.log(this.consumidorActual);

      console.log("Pedido actual");
      console.log(this.pedidoActual);
     
    }, 2500);
  }

  //#region ------------------------ Atributos ----------------------------
    public sonidoActivado:boolean = true;

    arrayConsumidores:any = [];
    consumidorActual:any;

    arrayPedidos:any = [];
    pedidoActual:any;

    arrayProductos:any = [];
    productosDelPedidoActual:any = [];
    productosBarPedidoActual:any = [];
    productosCocinaPedidoActual:any = [];

    propinaAumento:number; //En porcentaje del subtotal del pedido
    importeTotalCalculado:number = 0;

    cargaDeConsumidorTerminada = false;
    cargaDePedidoTerminada = false;
    cargaDeProductosDelPedidoTerminada = false;

    qrPropinaEscaneadoSatisfactoriamente = false;

    // flagNavigateLoging = true;

  //#endregion ------------------------ Atributos ----------------------------

  // ------------- Funcionamiento de sonido ----------------------//
  public switchearEstadoSonido()
  {
    this.sonidoActivado = !this.sonidoActivado;
    let iconoSonido = document.getElementById("icono-sonido-cuentaGenerada");
    
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
   
  detectarUsuarioYPedidoActual()
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
            console.log("Consumidor y pedido actual cargado!");
            this.consumidorActual = consumidor;
            this.detectarPedidoActual();
            this.cargarProductosPedidoActual();
            
            this.cargaDePedidoTerminada = true;
            this.cargaDeConsumidorTerminada = true;
            this.cargaDeProductosDelPedidoTerminada = true;
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
              console.log("Consumidor y pedido actual cargado!");
              this.consumidorActual = consumidor;
              this.detectarPedidoActual();
              this.cargarProductosPedidoActual();

              this.cargaDePedidoTerminada = true;
              this.cargaDeConsumidorTerminada = true;
              this.cargaDeProductosDelPedidoTerminada = true;
            }
        });
      });
    }

    this.cargaDeConsumidorTerminada = true;
  }

  detectarPedidoActual()
  {
    this.arrayPedidos.forEach(pedido => 
    {
        if (pedido.estado != 'finalizado' && pedido.consumidor == this.consumidorActual.nombre)
        {
          this.pedidoActual = pedido;
        }
    });
  }

  cargarProductosPedidoActual()
  {
    this.pedidoActual.carrito_bar.forEach(articuloBar => 
    {
      this.arrayProductos.forEach(producto => 
      {
        if (producto.tipo == "bebida" && producto.nombre == articuloBar)
        {
          this.productosBarPedidoActual.push(producto);
        }  
      });
    });

    this.pedidoActual.carrito_cocina.forEach(articuloCocina => 
      {
        this.arrayProductos.forEach(producto => 
        {
          if (producto.tipo == "comida" && producto.nombre == articuloCocina)
          {
            this.productosCocinaPedidoActual.push(producto);
          }  
        });
    });
  }

  public escenarQR_Propina()
  {
    //Leo el QR y el contenido devuelto lo cargo al formulario.
    this.srvLectorQR.openScan().then((stringObtenido)=>
    {
      let contenidoLeido = stringObtenido;
      let contenidoLeidoSpliteado = contenidoLeido.split("_");

      console.log(contenidoLeidoSpliteado);

      //Detengo el scanner.
      this.srvLectorQR.stopScan();

      if (contenidoLeidoSpliteado[1] != '1' && contenidoLeidoSpliteado[1] != '2' && contenidoLeidoSpliteado[1] != '3' && contenidoLeidoSpliteado[1] != '4' && contenidoLeidoSpliteado[1] != '5')
      {

        //Defino el porcentaje de descuento en cuestion de lo leido
        switch (contenidoLeidoSpliteado[1]) 
        {
          case '1':
          { 
            this.propinaAumento = 0;
            break;
          }
          case '2':
          { 
            this.propinaAumento = 5;
            break;
          }
          case '3':
          { 
            this.propinaAumento = 10;
            break;
          }
          case '4':
          { 
            this.propinaAumento = 15;
            break;
          }
          case '5':
          { 
            this.propinaAumento = 20;
            break;
          }
        }

        this.calcularYSetearImporteTotal();

        this.srvToast.mostrarToast("bottom","El QR pertenece a la propina de " + this.propinaAumento + "%.",3500,"success");
        this.srvSonidos.reproducirSonido("bubble", this.sonidoActivado);
        this.qrPropinaEscaneadoSatisfactoriamente = true;
  
      }
      else
      {
        this.srvToast.mostrarToast("bottom","El QR analizado no corresponde al de algun tipo de propina.",2500,"danger");
        this.srvSonidos.reproducirSonido("error", this.sonidoActivado);
      }
    });
  }

  calcularYSetearImporteTotal()
  {
    let importeTotal:number = 0;

    this.productosBarPedidoActual.forEach(articuloBar => 
    {
      importeTotal = importeTotal + articuloBar.precio;
    });

    this.productosCocinaPedidoActual.forEach(articuloCocina => 
    {
      importeTotal = importeTotal + articuloCocina.precio;
    });

    console.log("Propina: ");
    console.log(this.propinaAumento);

    if (this.propinaAumento != 0)
    {
      let aumentoAplicado = ((this.propinaAumento * importeTotal) / 100);
      importeTotal = importeTotal + aumentoAplicado;
    }
    else if (this.propinaAumento == 0)
    {
      importeTotal = importeTotal;
    }

    console.log("Importe total calculado: ");
    console.log(importeTotal);

    this.importeTotalCalculado = importeTotal;
  }

  public testing()
  {
      let stringObtenido = "qr_2";
      let contenidoLeido = stringObtenido;
      let contenidoLeidoSpliteado = contenidoLeido.split("_");

      let valorDescuento = contenidoLeidoSpliteado[1];
      console.log(valorDescuento);
      valorDescuento = valorDescuento.toString();

      if (valorDescuento == "1" || valorDescuento == "2" || valorDescuento == "3" || valorDescuento == "4" || valorDescuento == "5")
      {

        //Defino el porcentaje de descuento en cuestion de lo leido
        switch (valorDescuento) 
        {
          case '1':
          { 
            this.propinaAumento = 0;
            break;
          }
          case '2':
          { 
            this.propinaAumento = 5;
            break;
          }
          case '3':
          { 
            this.propinaAumento = 10;
            break;
          }
          case '4':
          { 
            this.propinaAumento = 15;
            break;
          }
          case '5':
          { 
            this.propinaAumento = 20;
            break;
          }
        }

        this.calcularYSetearImporteTotal();

        this.srvToast.mostrarToast("bottom","El QR pertenece a la propina de " + this.propinaAumento + "%.",3500,"success");
        this.srvSonidos.reproducirSonido("bubble", this.sonidoActivado);
        
        setTimeout(() => 
        {
          this.qrPropinaEscaneadoSatisfactoriamente = true;
        }, 500);   
      }
      else
      {
        this.srvToast.mostrarToast("bottom","El QR analizado no corresponde a ningún tipo de propina.",2500,"danger");
        this.srvSonidos.reproducirSonido("error", this.sonidoActivado);
      }
  }
}
