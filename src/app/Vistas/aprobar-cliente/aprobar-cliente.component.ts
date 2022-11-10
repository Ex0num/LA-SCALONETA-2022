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
    public srvMailSending:MailSendingService) { }

  ngOnInit() 
  {
    this.leerClientesPendientes();
  }

  //------------------------ Atributos ----------------------------
  sonidoActivado:boolean = true;

  public arrayClientesPendientes: any[] = [];

  accionarCliente(clienteRecibido:any, esAceptado:boolean, indiceLI:number)
  {
    if (esAceptado == true)
    {
      this.srvFirebase.setearEstadoCliente(clienteRecibido,'aprobado')

      this.srvToast.mostrarToast("top","¡Aprobado!",2000,"success");
      
      // //---- Aca aviso al mail ingresado y validado que su cuenta fue aceptada -----------
      //   this.srvMailSending.enviarMail(
      //   clienteRecibido.correo, 
      //   "Su cuenta fue aceptada en el sistema. ¡Ahora puede disfrutar de Ribato!.");
      // //----------------------------------------------------------------------------------
    }
    else
    {
      this.srvFirebase.setearEstadoCliente(clienteRecibido,'desaprobado')
      this.srvToast.mostrarToast("top","!Desaprobado!",2000,"danger");

      // //---- Aca aviso al mail ingresado y validado que su cuenta fue rechazada -----------
      //   this.srvMailSending.enviarMail(
      //   clienteRecibido.correo, 
      //   "Su cuenta fue rechazada del sistema. ¡Lo sentimos, en otra ocasión será!.");
      // //-----------------------------------------------------------------------------------
    }

    let arrayLI:any = document.querySelectorAll(".item-cliente-pendiente");
    arrayLI[indiceLI];
    console.log(arrayLI);
    console.log(arrayLI[indiceLI]);
    arrayLI[indiceLI].style.animation = "flip-out-hor-top 0.45s cubic-bezier(0.550, 0.085, 0.680, 0.530) both";
    
    setTimeout(() => 
    {
      this.arrayClientesPendientes = this.arrayClientesPendientes.filter( (element)=> 
      {
        //Filtro solo por los clientes que no tengan el mail
        if (element.correo != clienteRecibido.correo)
        {return -1}
        else {return 0};
      });
    }, 800);
    

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

  async leerClientesPendientes()
  {
    this.arrayClientesPendientes = await this.srvFirebase.leerClientesDB();
  }

}
