import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Servicios/auth.service';
import { FirebaseService } from 'src/app/Servicios/firebase.service';
import { ScannerQrService } from 'src/app/Servicios/scanner-qr.service';
import { SonidosPersonalizadosService } from 'src/app/Servicios/sonidos-personalizados.service';
import { ToastMsgService } from 'src/app/Servicios/toast-msg.service';

@Component({
  selector: 'app-mesa-home',
  templateUrl: './mesa-home.component.html',
  styleUrls: ['./mesa-home.component.scss'],
})
export class MesaHomeComponent implements OnInit {

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
        if (this.consumidorActual != undefined && this.consumidorActual.nombre == element.nombre)
        { 
          console.log("Actualizando data del consumidor actual...");
          this.consumidorActual = element;

          //Si la actualizacion es que ya fue asignado a una mesa y paso de "esperando_mesa" a "escaneando_mesa", lo llevamos al siguiente nivel
          if (this.consumidorActual.estado == 'escaneando_mesa') {this.router.navigateByUrl("mesa-home")}
        }
      })
    });


    setTimeout(() => 
    {
      //Me fijo quien esta logeado
      this.detectarUsuarioActual();
    }, 2500);

  }

  ngOnInit() {}

  //#region ------------------------ Atributos ----------------------------
  public sonidoActivado:boolean = true;

  arrayConsumidores:any = [];
  consumidorActual:any;

  cargaDeConsumidorTerminada = false;
  mesaEscaneadaSatisfactoriamente = false;

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
        this.mesaEscaneadaSatisfactoriamente = true;
        this.srvSonidos.reproducirSonido("bubble", this.sonidoActivado);
      }
      else
      {
        this.srvToast.mostrarToast("bottom","El QR analizado no corresponde a su mesa asignada.",2500,"danger");
        this.srvSonidos.reproducirSonido("error", this.sonidoActivado);
      }
    });
  }
}