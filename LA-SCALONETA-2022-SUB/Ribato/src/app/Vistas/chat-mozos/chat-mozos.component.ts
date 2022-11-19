import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Servicios/auth.service';
import { FirebaseService } from 'src/app/Servicios/firebase.service';
import { PushNotificationsService } from 'src/app/Servicios/push-notifications.service';
import { SonidosPersonalizadosService } from 'src/app/Servicios/sonidos-personalizados.service';
import { ToastMsgService } from 'src/app/Servicios/toast-msg.service';

@Component({
  selector: 'app-chat-mozos',
  templateUrl: './chat-mozos.component.html',
  styleUrls: ['./chat-mozos.component.scss'],
})
export class ChatMozosComponent implements OnInit {

  constructor(
    public srvFirebase:FirebaseService,
    public srvAuth:AuthService,
    public srvToast:ToastMsgService, 
    public srvSonidos:SonidosPersonalizadosService,
    public srvPushNotif:PushNotificationsService
  ) 
  {
    let observableMensajes = this.srvFirebase.listar_mensajes();
    observableMensajes.subscribe( (data) => 
    { 
      this.arrayMensajes = data;
      // this.srvSonidos.reproducirSonido("bubble",this.sonidoActivado);
    });

    let observableConsumidores = this.srvFirebase.listar_consumidores();
    observableConsumidores.subscribe( (data) => 
    { 
      this.arrayConsumidores = data;
    });
  }

  ngOnInit() 
  {
    setTimeout(() => 
    {
      this.spinnerMostrandose = false;
    },2000);
  }

  //#region ------------------------ Atributos ----------------------------
  public sonidoActivado:boolean = true;
  public spinnerMostrandose = true;

  public mensajeRedactado = "";

  public arrayMensajes:any = [];
  public arrayConsumidores:any = [];
  //#endregion ----------------------------------------------------------//

  enviarMensaje()
  {
    //El mensaje tiene que ser menor a 36 caracteres
    if (this.mensajeRedactado.length < 36 || this.mensajeRedactado == "" || this.mensajeRedactado == " " || this.mensajeRedactado == undefined)
    {
      if (this.srvAuth.nombreDelAnonimo != undefined)
      {
        //Es un mensaje de un anonimo
        let numeroMesaAnonimo = this.obtenerNumeroMesaByNombreConsumidor(this.srvAuth.nombreDelAnonimo);
        this.srvFirebase.alta_mensaje(this.mensajeRedactado,this.srvAuth.nombreDelAnonimo,'anonimo', numeroMesaAnonimo);
        
        // ------- Aca envio el push notification -------------
        //
        // VA PARA EL CELULAR MOZO (NADIA)
        // 
        this.srvPushNotif
        .sendPushNotification({
          // eslint-disable-next-line @typescript-eslint/naming-convention
          registration_ids: [
            // eslint-disable-next-line max-len
            'dlsUeiVMQEqe_HbeaoFYqT:APA91bFM3TjHo8VicJXsefO-Hq8omdkcKSkSE-ftS3eubQ3mUM4h6qDG3IfsS02PS938QMMEGUOuX05Oitie0xucJP6ko7ktRYbRRn50o1z2Rs7_k0cqOaPGHzpJi6q0P0FAAL08PnZD',
          ],
          notification: {
            title: 'Consulta rapida',
            body: 'Hay un nuevo mensaje en el chat.',
          },
        })
        .subscribe((data) => {
          console.log(data);
        });

        //---------------------------------------------------------

        //Limpio el input
        this.mensajeRedactado = "";
      }
      else
      {
        //Es un mensaje por medio de un mail registrado (osea que es cliente o mozo), por lo que necesito saber su tipo
        if (this.srvAuth.tipoUserloged == 'mozo')
        {
          this.srvFirebase.alta_mensaje(this.mensajeRedactado,this.srvAuth.userLogedData.email,'mozo', -1);

          //Limpio el input
          this.mensajeRedactado = "";
        }
        else //El mensaje es de un cliente registrado
        {
          //Es un mensaje de un anonimo
          let numeroMesaClienteLogeado = this.obtenerNumeroMesaByNombreConsumidor(this.srvAuth.dataUsuarioLogeado.correo);
          this.srvFirebase.alta_mensaje(this.mensajeRedactado,this.srvAuth.dataUsuarioLogeado.correo,'anonimo', numeroMesaClienteLogeado);
          
          // ------- Aca envio el push notification -------------
          //
          // VA PARA EL CELULAR MOZO (NADIA)
          // 
          this.srvPushNotif
          .sendPushNotification({
            // eslint-disable-next-line @typescript-eslint/naming-convention
            registration_ids: [
              // eslint-disable-next-line max-len
              'dlsUeiVMQEqe_HbeaoFYqT:APA91bFM3TjHo8VicJXsefO-Hq8omdkcKSkSE-ftS3eubQ3mUM4h6qDG3IfsS02PS938QMMEGUOuX05Oitie0xucJP6ko7ktRYbRRn50o1z2Rs7_k0cqOaPGHzpJi6q0P0FAAL08PnZD',
            ],
            notification: {
              title: 'Consulta rapida',
              body: 'Hay un nuevo mensaje en el chat.',
            },
          })
          .subscribe((data) => {
            console.log(data);
          });

          //---------------------------------------------------------
          
          //Limpio el input
          this.mensajeRedactado = "";
        } 
      }
    }
    else
    {
       if (this.mensajeRedactado.length >= 36)
       {
        this.srvToast.mostrarToast("top","El mensaje no puede superar los 36 caracteres",2000,"danger");
        this.srvSonidos.reproducirSonido("error",this.sonidoActivado);
       }
       else if (this.mensajeRedactado == "" || this.mensajeRedactado == " " || this.mensajeRedactado == undefined)
       {
        this.srvToast.mostrarToast("top","El mensaje no puede no contener un texto",2000,"danger");
        this.srvSonidos.reproducirSonido("error",this.sonidoActivado);
       }
    }
  }

  obtenerNumeroMesaByNombreConsumidor(nombreConsumidorRecibido:string)
  {
    let numeroMesa:string = "-1";

    this.arrayConsumidores.forEach(consumidor => 
    {
      if (consumidor.nombre == nombreConsumidorRecibido)  
      {
        console.log("Consumidor encontrado.");
        numeroMesa = consumidor.mesaAsignada;
      }
    });

    console.log("Buscando la mesa que le corresponde al consumidor: " + nombreConsumidorRecibido);
    console.log("Mesa encontrada"+ numeroMesa);

    return numeroMesa;
  }

  // ------------- Funcionamiento de sonido ----------------------//
  public switchearEstadoSonido()
  {
    this.sonidoActivado = !this.sonidoActivado;
    let iconoSonido = document.getElementById("icono-sonido-mensajeria");
    
    if (this.sonidoActivado == true)
    {
      iconoSonido.setAttribute("name","volume-mute");
    }
    else
    {
      iconoSonido.setAttribute("name","radio");
    }
  }
  //--

}
