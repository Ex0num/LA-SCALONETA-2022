import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { element } from 'protractor';
import { AuthService } from 'src/app/Servicios/auth.service';
import { FirebaseService } from 'src/app/Servicios/firebase.service';
import { ScannerQrService } from 'src/app/Servicios/scanner-qr.service';
import { SonidosPersonalizadosService } from 'src/app/Servicios/sonidos-personalizados.service';
import { ToastMsgService } from 'src/app/Servicios/toast-msg.service';
import { HomeComponent } from '../home.component';

@Component({
  selector: 'app-home-cliente',
  templateUrl: './home-cliente.component.html',
  styleUrls: ['./home-cliente.component.scss'],
})
export class HomeClienteComponent implements OnInit {

  constructor(
    public srvLectorQR:ScannerQrService,
    public srvToast:ToastMsgService, 
    public srvSonidos:SonidosPersonalizadosService,
    public srvFirebase:FirebaseService,
    public srvAuth:AuthService,
    public router:Router
  ) 
  {
    //Me traigo los consumidores
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
  }

  ngOnInit() {}

  //#region ------------------------ Atributos ---------------------------------
  clienteEnListaDeEspera = false;
  consumidorFueCargado = false;

  arrayConsumidores:any = [];
  consumidorActual:any;
  //#endregion -------------------------------------------------------------------

  //------------------ Funciones generales ---------------------

  public escenarQR_Ingreso()
  {
    //Leo el QR y el contenido devuelto lo cargo al formulario.
    this.srvLectorQR.openScan().then((stringObtenido)=>
    {
      let contenidoLeido = stringObtenido;

      //Detengo el scanner.
      this.srvLectorQR.stopScan();

      if (contenidoLeido == "ingreso_local")
      {
        this.srvToast.mostrarToast("bottom","El ingreso al local fue satisfactorio. Espere a ser asignado una mesa.",2500,"success");
        this.srvSonidos.reproducirSonido("bubble", HomeComponent.prototype.sonidoActivado);

        //Aca envio el push notification al METRE. Hay un nuevo cliente en la lista de espera
        // TO DO
        //----------------------------
        
        //Si la sesion es anonima el alta del consumidor se hace con el nombre del anonimo
        if (this.srvAuth.nombreDelAnonimo != undefined)
        {
          console.log("Dando de alta consumidor ANONIMO");
          console.log(this.srvAuth.nombreDelAnonimo);
    
          this.srvFirebase.alta_consumidor(this.srvAuth.nombreDelAnonimo);   
    
          setTimeout(() => 
          {
            this.arrayConsumidores.forEach(element => 
              {
                if (element.nombre == this.srvAuth.nombreDelAnonimo)
                {
                  console.log("Encontrado el consumidor dado de alta! (QUE ERA ANONIMO)");
                  console.log(this.consumidorActual);
                  this.consumidorActual = element;
                  this.consumidorFueCargado = true;
                  this.clienteEnListaDeEspera = true;
                }
              });
    
          }, 2000);
    
        }
        else
        {
          //Si no, el alta del consumidor se hace con el mail del logeado
          let mailLogeado; 
    
          this.srvAuth.afAuth.user.subscribe((data) => 
          {
            mailLogeado = data.email;
    
            console.log("Dando de alta consumidor LOGEADO");
            console.log(mailLogeado);
            this.srvFirebase.alta_consumidor(mailLogeado); 
    
            setTimeout(() => 
            {
              this.arrayConsumidores.forEach(element => 
                {
                  if (element.nombre == mailLogeado)
                  {
                    console.log("Encontrado el consumidor dado de alta! (QUE ERA CLIENTE REGISTRADO)");
                    console.log(this.consumidorActual);
                    this.consumidorActual = element;
                    this.consumidorFueCargado = true;
                    this.clienteEnListaDeEspera = true;
                  }
                });
      
            }, 2000);
    
          });
        }

      }
      else
      {
        this.srvToast.mostrarToast("bottom","El QR analizado no corresponde al ingreso al local.",2500,"danger");
        this.srvSonidos.reproducirSonido("error", HomeComponent.prototype.sonidoActivado);
      }
    });
  }

  testing()
  {
    this.srvToast.mostrarToast("bottom","El ingreso al local fue satisfactorio. Espere a ser asignado una mesa.",2500,"success");

    //Aca envio el push notification al METRE. Hay un nuevo cliente en la lista de espera
    // TO DO
    //----------------------------
    
    //Si la sesion es anonima el alta del consumidor se hace con el nombre del anonimo
    if (this.srvAuth.nombreDelAnonimo != undefined)
    {
      console.log("Dando de alta consumidor ANONIMO");
      console.log(this.srvAuth.nombreDelAnonimo);

      this.srvFirebase.alta_consumidor(this.srvAuth.nombreDelAnonimo);   

      setTimeout(() => 
      {
        this.arrayConsumidores.forEach(element => 
          {
            if (element.nombre == this.srvAuth.nombreDelAnonimo)
            {
              console.log("Encontrado el consumidor dado de alta! (QUE ERA ANONIMO)");
              console.log(this.consumidorActual);
              this.consumidorActual = element;
              this.consumidorFueCargado = true;
              this.clienteEnListaDeEspera = true;
            }
          });

      }, 2000);

    }
    else
    {
      //Si no, el alta del consumidor se hace con el mail del logeado
      let mailLogeado; 

      this.srvAuth.afAuth.user.subscribe((data) => 
      {
        mailLogeado = data.email;

        console.log("Dando de alta consumidor LOGEADO");
        console.log(mailLogeado);
        this.srvFirebase.alta_consumidor(mailLogeado); 

        setTimeout(() => 
        {
          this.arrayConsumidores.forEach(element => 
            {
              if (element.nombre == mailLogeado)
              {
                console.log("Encontrado el consumidor dado de alta! (QUE ERA CLIENTE REGISTRADO)");
                console.log(this.consumidorActual);
                this.consumidorActual = element;
                this.consumidorFueCargado = true;
                this.clienteEnListaDeEspera = true;
              }
            });
  
        }, 2000);

      });
     
    }
  }
}
