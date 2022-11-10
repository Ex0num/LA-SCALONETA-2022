import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Servicios/auth.service';
import { SonidosPersonalizadosService } from 'src/app/Servicios/sonidos-personalizados.service';
import { ToastMsgService } from 'src/app/Servicios/toast-msg.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  constructor(
    public srvToast:ToastMsgService, 
    public srvSonidos:SonidosPersonalizadosService,
    public router:Router,
    public srvAuth:AuthService) 
  {}

  ngOnInit() 
  {
    setTimeout(() => 
    {
      this.asignarAnimaciones();
    }, 100);
  }

//------------------------ Atributos ----------------------------

  mailIngresado:string = "";
  passwordIngresada:string = "";

  sonidoActivado:boolean = true;

  userCredential:any;

//----------------------- Login y register ---------------------
  async login()
  {
    //Validacion precaria para evitar errores
    if (this.mailIngresado != "" && this.mailIngresado.includes("@") == true && this.passwordIngresada != "" && this.passwordIngresada.length > 3 && this.passwordIngresada.length < 60)
    {
      let userCredential = await this.srvAuth.login(this.mailIngresado, this.passwordIngresada, this.sonidoActivado);
      console.log(userCredential);

      if (userCredential != undefined) 
      {
        this.limpiarControlesLogin(); 
        this.srvToast.mostrarToast("bottom","Bienvenido/a  " + userCredential.email ,2000,"success");
        this.srvSonidos.reproducirSonido("ingreso", this.sonidoActivado);
        this.router.navigateByUrl("home");
      };
    } 
    else
    {
      if (this.mailIngresado == "" || this.mailIngresado == undefined || this.mailIngresado.includes("@") == false)
      {
        this.srvToast.mostrarToast("bottom","Verifique el mail ingresado.",3000,"danger");
        this.srvSonidos.reproducirSonido("error",this.sonidoActivado);
      }
      else if (this.passwordIngresada == "" || this.passwordIngresada.length < 3 || this.passwordIngresada.length > 60)
      {
        this.srvToast.mostrarToast("bottom","Verifique la contraseña ingresada.",3000,"danger");
        this.srvSonidos.reproducirSonido("error",this.sonidoActivado);
      }
    }
  }

  register()
  {
    this.srvSonidos.reproducirSonido('cambio-pag',this.sonidoActivado);
    //--
    // AltaClienteComponent.prototype.fotosHabilitadas = true;
    // AltaClienteComponent.prototype.esRegistroAnonimo = undefined;
    //--
    this.router.navigateByUrl('alta-cliente');
  }

//------------- Autocompletado de datos ---------------------
  onChange($event)
  {
    let valueSelected = $event.target.value;

    let txtBoxMail = document.getElementById("mail");
    let txtBoxPassword = document.getElementById("password");

    switch (valueSelected) 
    {
      case "Dueño":
      {
        console.log("Logeo rapido de dueño");

        txtBoxMail.setAttribute("value","dueno@gmail.com");
        txtBoxPassword.setAttribute("value","123123");

        break;
      }
      case "Supervisor":
        {
          console.log("Logeo rapido de supervisor");
  
          txtBoxMail.setAttribute("value","supervisor@gmail.com");
          txtBoxPassword.setAttribute("value","123123");
  
          break;
        }
      case "Metre":
      {
        console.log("Logeo rapido de metre");

        txtBoxMail.setAttribute("value","metre@gmail.com");
        txtBoxPassword.setAttribute("value","123123");

        break;
      }
      case "Mozo":
      {
        console.log("Logeo rapido de mozo");

        txtBoxMail.setAttribute("value","mozo@gmail.com");
        txtBoxPassword.setAttribute("value","123123");

        break;
      }
      case "Cocinero":
      {
        console.log("Logeo rapido de cocinero");

        txtBoxMail.setAttribute("value","cocinero@gmail.com");
        txtBoxPassword.setAttribute("value","123123");

        break;
      }
      case "Bartender":
      {
        console.log("Logeo rapido de bartender");

        txtBoxMail.setAttribute("value","bartender@gmail.com");
        txtBoxPassword.setAttribute("value","123123");

        break;
      }
      case "Cliente":
      {
        console.log("Logeo rapido de cliente");

        txtBoxMail.setAttribute("value","cliente@gmail.com");
        txtBoxPassword.setAttribute("value","123123");

        break;
      }
    }
  }

  private limpiarControlesLogin()
  {
    this.mailIngresado = "";
    this.passwordIngresada = "";
  }

//------------- Funcionamiento de sonido ----------------------
  switchearEstadoSonido()
  {
    this.sonidoActivado = !this.sonidoActivado;
    let iconoSonido = document.getElementById("icono-sonido");

    if (this.sonidoActivado == true)
    {
      iconoSonido.setAttribute("name","volume-mute");
    }
    else
    {
      iconoSonido.setAttribute("name","radio");
    }
  }

//------------- Asignacion de animaciones ----------------------
  private asignarAnimaciones()
  {
     //Efecto fade
     let contenedorPrincipal = document.getElementById("main-card-2");
     contenedorPrincipal.style.animation = "fade-in-fwd 0.8s cubic-bezier(0.390, 0.575, 0.565, 1.000) both";
 
     //Efecto latido
     let iconoApp = document.getElementById("icono-principal");
     iconoApp.style.animation = "jello-horizontal 4s 1s infinite";
  }
}
