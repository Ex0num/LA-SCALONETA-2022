import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Servicios/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit 
{

  constructor(public srvAuth:AuthService, public router:Router) {}

  //------------------------ Atributos ---------------------------- //
  public tipoUsuarioLogeado:any;
  public dataUsuarioLogeado:any;

  rangoUsuarioLogeado;
  mailUsuarioLogeado;

  sonidoActivado:boolean = true;
  spinnerMostrandose:boolean = true;
  //-------------------------------------------------------------- //
  
  async ngOnInit() 
  {
    let mail_de_sesion_actual = await this.srvAuth.sesionActual();
    console.log(mail_de_sesion_actual);

    if (mail_de_sesion_actual != undefined)
    {
      this.dataUsuarioLogeado = await this.srvAuth.obtenerDatosMailRecibido(mail_de_sesion_actual);
      this.tipoUsuarioLogeado = await this.dataUsuarioLogeado.tipo;

      let tipoAMostrar = this.traducirTipoAFormaVisual(this.tipoUsuarioLogeado);
      this.rangoUsuarioLogeado = tipoAMostrar;
      this.mailUsuarioLogeado = this.dataUsuarioLogeado.correo;

      this.spinnerMostrandose = false;
    }
    else
    {
      this.tipoUsuarioLogeado = 'anonimo';

      let tipoAMostrar = this.traducirTipoAFormaVisual(this.tipoUsuarioLogeado);
      this.rangoUsuarioLogeado = tipoAMostrar;
      this.mailUsuarioLogeado = "Mail inexistente";

      this.spinnerMostrandose = false;
    }
    
    console.log(this.dataUsuarioLogeado);
  }

  deslogearSesion()
  {
    this.srvAuth.logOut();
    this.router.navigateByUrl("login");
  }

  traducirTipoAFormaVisual(tipoUsuarioCrudo:string)
  {
    let resultado;

    switch (tipoUsuarioCrudo) 
    {
      case 'cliente':
      {
        resultado = "Cliente";
        break;
      }
      case 'anonimo':
      {
        resultado = "Anónimo";
        break;
      }
      case 'dueno':
      {
        resultado = "Dueño";
        break;
      }
      case 'supervisor':
      {
        resultado = "Supervisor";
        break;
      }
      case 'bartender':
      {
        resultado = "Bartender";
        break;
      }
      case 'metre':
      {
        resultado = "Metre";
        break;
      }
      case 'cocinero':
      {
        resultado = "Cocinero";
        break;
      }
      case 'mozo':
      {
        resultado = "Mozo";
        break;
      }
    }

    return resultado;
  }

  //------------- Funcionamiento de sonido ----------------------
  switchearEstadoSonido()
  {
    this.sonidoActivado = !this.sonidoActivado;
    let iconoSonido = document.getElementById("icono-sonido-home");

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
