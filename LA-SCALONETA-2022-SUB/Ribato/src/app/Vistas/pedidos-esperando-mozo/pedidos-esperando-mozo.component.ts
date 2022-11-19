import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Servicios/auth.service';
import { FirebaseService } from 'src/app/Servicios/firebase.service';
import { MailSendingService } from 'src/app/Servicios/mail-sending.service';
import { PushNotificationsService } from 'src/app/Servicios/push-notifications.service';
import { SonidosPersonalizadosService } from 'src/app/Servicios/sonidos-personalizados.service';
import { ToastMsgService } from 'src/app/Servicios/toast-msg.service';

@Component({
  selector: 'app-pedidos-esperando-mozo',
  templateUrl: './pedidos-esperando-mozo.component.html',
  styleUrls: ['./pedidos-esperando-mozo.component.scss'],
})
export class PedidosEsperandoMozoComponent implements OnInit {

  constructor(
    public srvFirebase:FirebaseService,
    public srvToast:ToastMsgService, 
    public srvSonidos:SonidosPersonalizadosService,
    public srvMailSending:MailSendingService,
    public srvAuth:AuthService,
    public srvPushNotif:PushNotificationsService) 
  {
    this.srvFirebase.listar_pedidos().subscribe((data)=>
    {
      this.arrayPedidos = data;
    });
  }

  ngOnInit() 
  {
    setTimeout(() => 
    {
      this.spinnerMostrandose = false;

    }, 2500);
  }

  //------------------------ Atributos ----------------------------
  sonidoActivado:boolean = true;
  spinnerMostrandose = true;

  public arrayPedidos: any[] = [];

  responsabilizarseDelPedido(pedidoRecibido)
  {
    //Le asigno el mozo responsable y el nuevo estado del pedido. Ya fue confirmado. Ahora a la cocina!!!
    let mailMozoResponsable = this.srvAuth.userLogedData.email;
    //let mailMozoResponsable = 'probando@123.cpom';
    pedidoRecibido.mozo = mailMozoResponsable;
    pedidoRecibido.estado = 'en_preparacion';

    this.srvFirebase.modificar_pedido(pedidoRecibido,pedidoRecibido.id);

    if (pedidoRecibido.carrito_cocina.length > 0)
    {
      // ------- Aca envio el push notification -------------
      //
      // VA PARA EL CELULAR COCINERO (NADIA)
      // 
      this.srvPushNotif
      .sendPushNotification({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        registration_ids: [
          // eslint-disable-next-line max-len
          'dlsUeiVMQEqe_HbeaoFYqT:APA91bFM3TjHo8VicJXsefO-Hq8omdkcKSkSE-ftS3eubQ3mUM4h6qDG3IfsS02PS938QMMEGUOuX05Oitie0xucJP6ko7ktRYbRRn50o1z2Rs7_k0cqOaPGHzpJi6q0P0FAAL08PnZD',
        ],
        notification: {
          title: 'Cocina nuevas tareas',
          body: 'Hay un nuevo pedido correspondiente a la cocina.',
        },
      })
      .subscribe((data) => {
        console.log(data);
      });
      //---------------------------------------------------------
    }

    if (pedidoRecibido.carrito_bar.length > 0)     
    {
      //---------------------------------------------------------

      // ------- Aca envio el push notification -------------
      //
      // VA PARA EL CELULAR BARTENDER (MATEO)
      // 
      this.srvPushNotif
      .sendPushNotification({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        registration_ids: [
          // eslint-disable-next-line max-len
          'dlsUeiVMQEqe_HbeaoFYqT:APA91bFM3TjHo8VicJXsefO-Hq8omdkcKSkSE-ftS3eubQ3mUM4h6qDG3IfsS02PS938QMMEGUOuX05Oitie0xucJP6ko7ktRYbRRn50o1z2Rs7_k0cqOaPGHzpJi6q0P0FAAL08PnZD',
        ],
        notification: {
          title: 'Bar nuevas tareas',
          body: 'Hay un nuevo pedido correspondiente al bar.',
        },
      })
      .subscribe((data) => {
        console.log(data);
      });

      //---------------------------------------------------------
    }
     
  }

  //------------- Funcionamiento de sonido ----------------------
  switchearEstadoSonido()
  {
    this.sonidoActivado = !this.sonidoActivado;
    let iconoSonido = document.getElementById("icono-sonido-pedidosEnEspera");

    if (this.sonidoActivado == true)
    {
      iconoSonido.setAttribute("name","volume-mute");
    }
    else
    {
      iconoSonido.setAttribute("name","radio");
    }
  }

}
