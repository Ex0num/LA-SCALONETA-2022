import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/Servicios/firebase.service';
import { MailSendingService } from 'src/app/Servicios/mail-sending.service';
import { SonidosPersonalizadosService } from 'src/app/Servicios/sonidos-personalizados.service';
import { ToastMsgService } from 'src/app/Servicios/toast-msg.service';

@Component({
  selector: 'app-clientes-esperando-mesa',
  templateUrl: './clientes-esperando-mesa.component.html',
  styleUrls: ['./clientes-esperando-mesa.component.scss'],
})
export class ClientesEsperandoMesaComponent implements OnInit {

  constructor(
    public srvFirebase:FirebaseService,
    public srvToast:ToastMsgService, 
    public srvSonidos:SonidosPersonalizadosService,
    public srvMailSending:MailSendingService) 
  {
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
    setTimeout(() => 
    {
      this.spinnerMostrandose = false;

    }, 2500);
  }

  //------------------------ Atributos ----------------------------
  sonidoActivado:boolean = true;
  spinnerMostrandose = true;

  public arrayConsumidores: any[] = [];
  public arrayMesas: any[] = [];

  public consumidorSeleccionado:any;
  public nombre_consumidorSeleccionado:string = "Cliente";

  public mesaSeleccionada:any;
  public numero_mesaSeleccionada:string = "Numero";

  elegirConsumidor(consumidorSeleccionadoRecibido:any, indiceHTMLElement:number)
  {
    this.consumidorSeleccionado = consumidorSeleccionadoRecibido;
    this.nombre_consumidorSeleccionado = consumidorSeleccionadoRecibido.nombre;
  }

  elegirMesa(mesaSeleccionadaRecibida:any, indiceHTMLElement:number)
  {
    this.mesaSeleccionada = mesaSeleccionadaRecibida;
    this.numero_mesaSeleccionada = mesaSeleccionadaRecibida.numeroMesa;
  }

  asignarMesa()
  {
    //Me fijo si la mesa sigue disponible
    this.arrayMesas.forEach(mesa => 
    {
      if ((mesa.numeroMesa == this.numero_mesaSeleccionada && mesa.estado == 'disponible'))
      {
        //Me fijo si el consumidor sigue necesitando la asignacion
        this.arrayConsumidores.forEach(consumidor => 
        {
            if(consumidor.nombre == this.nombre_consumidorSeleccionado && consumidor.estado == 'esperando_mesa')
            {
              //Se hace la modificacion tanto del estado de la mesa como del consumidor
              this.mesaSeleccionada.estado = 'ocupada';
              this.srvFirebase.modificar_mesa(this.mesaSeleccionada, this.mesaSeleccionada.id);

              this.consumidorSeleccionado.estado = 'escaneando_mesa';
              this.consumidorSeleccionado.mesaAsignada = this.numero_mesaSeleccionada;
              this.srvFirebase.modificar_consumidor(this.consumidorSeleccionado, this.consumidorSeleccionado.id);

              this.nombre_consumidorSeleccionado = "Consumidor";
              this.numero_mesaSeleccionada = "Numero";
            }
        });
      }
    });
  }

  //------------- Funcionamiento de sonido ----------------------
  switchearEstadoSonido()
  {
    this.sonidoActivado = !this.sonidoActivado;
    let iconoSonido = document.getElementById("icono-sonido-aprobacionCli");

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
