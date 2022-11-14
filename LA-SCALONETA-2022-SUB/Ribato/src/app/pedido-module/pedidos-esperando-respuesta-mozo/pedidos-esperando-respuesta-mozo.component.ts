import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Servicios/auth.service';
import { FirebaseService } from 'src/app/Servicios/firebase.service';
import { MailSendingService } from 'src/app/Servicios/mail-sending.service';
import { SonidosPersonalizadosService } from 'src/app/Servicios/sonidos-personalizados.service';
import { ToastMsgService } from 'src/app/Servicios/toast-msg.service';

@Component({
  selector: 'app-pedidos-esperando-respuesta-mozo',
  templateUrl: './pedidos-esperando-respuesta-mozo.component.html',
  styleUrls: ['./pedidos-esperando-respuesta-mozo.component.scss'],
})
export class PedidosEsperandoRespuestaMozoComponent implements OnInit {

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

    this.srvFirebase.listar_consumidores().subscribe((data)=>
    {
      this.arrayConsumidores = data;
    });

    this.srvFirebase.listar_mesas().subscribe((data)=>
    {
      this.arrayMesas = data;
    });
  }

  ngOnInit() 
  {
    this.nombreMozo = this.srvAuth.userLogedData.email;

    setTimeout(() => 
    {
      this.spinnerMostrandose = false;

    }, 2500);
  }

  //------------------------ Atributos ----------------------------
  public nombreMozo:string;
  sonidoActivado:boolean = true;
  spinnerMostrandose = true;

  public arrayPedidos: any[] = [];
  public arrayConsumidores: any[] = [];
  public arrayMesas: any[] = [];

  // responsabilizarseDelPedido(pedidoRecibido)
  // {
  //   //Le asigno el mozo responsable y el nuevo estado del pedido. Ya fue confirmado. Ahora a la cocina!!!
  //   let mailMozoResponsable = this.srvAuth.userLogedData.email;
  //   //let mailMozoResponsable = 'probando@123.cpom';
  //   pedidoRecibido.mozo = mailMozoResponsable;
  //   pedidoRecibido.estado = 'en_preparacion';

  //   this.srvFirebase.modificar_pedido(pedidoRecibido,pedidoRecibido.id);
  // }

  entregarPedido(pedidoRecibido)
  {
    pedidoRecibido.estado = 'entregado_sin_confirmar';
    this.srvFirebase.modificar_pedido(pedidoRecibido, pedidoRecibido.id);
    this.srvToast.mostrarToast("top","El pedido fue enviado satisfactoriamente. Se espera la confirmación del cliente",2800,"success");
    this.srvSonidos.reproducirSonido("bubble",this.sonidoActivado);
  }

  cobrarPedido(pedidoRecibido)
  {
    pedidoRecibido.estado = 'finalizado';
    this.srvFirebase.modificar_pedido(pedidoRecibido, pedidoRecibido.id);

    //Se libera la mesa y se cambia al estado final, el estado del consumidor se indica como retirado
    let mesaEncontrada = this.buscarMesaByNumero(pedidoRecibido.mesa);
    mesaEncontrada.estado = 'disponible';
    this.srvFirebase.modificar_mesa(mesaEncontrada, mesaEncontrada.id);

    let consumidorEncontrado = this.buscarConsumidorByNombreYMesa(pedidoRecibido.consumidor, mesaEncontrada.numeroMesa)
    consumidorEncontrado.estado = 'retirado';
    this.srvFirebase.modificar_consumidor(consumidorEncontrado, consumidorEncontrado.id);

    this.srvToast.mostrarToast("top","El pedido fue cobrado satisfactoriamente. Se liberará la mesa",2800,"success");
    this.srvSonidos.reproducirSonido("bubble",this.sonidoActivado);
  }

  buscarMesaByNumero(numeroMesaRecibido:any)
  {
    let mesaEncontrada;

    this.arrayMesas.forEach(mesa => 
    {
      if (mesa.numeroMesa == numeroMesaRecibido)
      {
        mesaEncontrada = mesa;
      }
    });

    return mesaEncontrada;
  }

  buscarConsumidorByNombreYMesa(nombreConsumidorRecibido, numeroMesaRecibido)
  {
    let consumidorEncontrado;

    this.arrayConsumidores.forEach(consumidor => 
    {
      if (consumidor.nombre == nombreConsumidorRecibido && consumidor.mesaAsignada == numeroMesaRecibido && consumidor.estado != 'retirado')
      {
        consumidorEncontrado = consumidor;
      }
    });

    return consumidorEncontrado;
  }

  //------------- Funcionamiento de sonido ----------------------
  switchearEstadoSonido()
  {
    this.sonidoActivado = !this.sonidoActivado;
    let iconoSonido = document.getElementById("icono-sonido-pedidosEnEsperaRespuesta");

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
