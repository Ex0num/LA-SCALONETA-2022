import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/Servicios/firebase.service';
import { MailSendingService } from 'src/app/Servicios/mail-sending.service';
import { SonidosPersonalizadosService } from 'src/app/Servicios/sonidos-personalizados.service';
import { ToastMsgService } from 'src/app/Servicios/toast-msg.service';

@Component({
  selector: 'app-aprobar-cliente',
  templateUrl: './aprobar-cliente.component.html',
  styleUrls: ['./aprobar-cliente.component.scss'],
})
export class AprobarClienteComponent implements OnInit {

  constructor(
    public srvFirebase:FirebaseService,
    public srvToast:ToastMsgService, 
    public srvSonidos:SonidosPersonalizadosService,
    public srvMailSending:MailSendingService) 
  {
    this.srvFirebase.listar_clientesNormales().subscribe((data)=>
    {
      this.arrayClientes = data;
    })
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

  public arrayClientes: any[] = [];

  accionarCliente(clienteRecibido:any, esAceptado:boolean, indiceLI:number)
  {
    if (esAceptado == true)
    {
      clienteRecibido.estado = 'aprobado';
      this.srvFirebase.modificar_clienteNormal(clienteRecibido, clienteRecibido.id)

      this.srvToast.mostrarToast("top","¡Aprobado!",2000,"success");
      
      //---- Aca aviso al mail ingresado y validado que su cuenta fue aceptada -----------
        this.srvMailSending.enviarMail(
        clienteRecibido.correo, 
        "Su cuenta fue aceptada en el sistema. ¡Ahora puede disfrutar de Ribato!.");
      //----------------------------------------------------------------------------------
    }
    else
    {
      clienteRecibido.estado = 'desaprobado';
      this.srvFirebase.modificar_clienteNormal(clienteRecibido,clienteRecibido.id)
      this.srvToast.mostrarToast("top","!Desaprobado!",2000,"danger");

      //---- Aca aviso al mail ingresado y validado que su cuenta fue rechazada -----------
        this.srvMailSending.enviarMail(
        clienteRecibido.correo, 
        "Su cuenta fue rechazada del sistema. ¡Lo sentimos, en otra ocasión será!.");
      //-----------------------------------------------------------------------------------
    }

    let arrayLI:any = document.querySelectorAll(".item-cliente-pendiente");
    arrayLI[indiceLI];
    console.log(arrayLI);
    console.log(arrayLI[indiceLI]);
    arrayLI[indiceLI].style.animation = "flip-out-hor-top 0.80s cubic-bezier(0.550, 0.085, 0.680, 0.530) both";

    setTimeout(() => 
    {
      arrayLI[indiceLI].setAttribute("hidden","true");
    }, 1000);

    this.srvSonidos.reproducirSonido("bubble", this.sonidoActivado); 
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
