import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Servicios/auth.service';
import { FirebaseService } from 'src/app/Servicios/firebase.service';
import { MailSendingService } from 'src/app/Servicios/mail-sending.service';
import { SonidosPersonalizadosService } from 'src/app/Servicios/sonidos-personalizados.service';
import { ToastMsgService } from 'src/app/Servicios/toast-msg.service';

@Component({
  selector: 'app-pedidos-pendientes-cocina',
  templateUrl: './pedidos-pendientes-cocina.component.html',
  styleUrls: ['./pedidos-pendientes-cocina.component.scss'],
})
export class PedidosPendientesCocinaComponent implements OnInit {

  constructor(
    public srvFirebase:FirebaseService,
    public srvToast:ToastMsgService, 
    public srvSonidos:SonidosPersonalizadosService,
    public srvAuth:AuthService) 
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

  //------------------------ Atributos ---------------------------- //

  sonidoActivado:boolean = true;
  spinnerMostrandose:boolean = true;

  arrayPedidos:any = [];

  terminarPedidoCocina(pedidoTerminado:any)
  {
    console.log(pedidoTerminado);

    pedidoTerminado.estado_cocina_finalizado = true;
    this.srvToast.mostrarToast("bottom","El pedido por parte de la cocina ya fue marcado como finalizado. ¡Genial!",2500,"success");
    this.srvSonidos.reproducirSonido("bubble",this.sonidoActivado);

    //Significa que el pedido acaba de finalizar
    if (pedidoTerminado.estado_bar_finalizado == true)
    {
      pedidoTerminado.estado = 'preparado';
    }

    this.srvFirebase.modificar_pedido(pedidoTerminado, pedidoTerminado.id);
  }

  //------------- Funcionamiento de sonido --------------------------
  switchearEstadoSonido()
  {
    this.sonidoActivado = !this.sonidoActivado;
    let iconoSonido = document.getElementById("icono-sonido-pedidosPendientesCocina");

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
