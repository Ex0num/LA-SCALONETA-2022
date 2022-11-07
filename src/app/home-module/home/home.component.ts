import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Servicios/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit 
{

  constructor(public srvAuth:AuthService) {}

  //------------------------ Atributos ---------------------------- //
  public tipoUsuarioLogeado:any;
  public dataUsuarioLogeado:any;

  //-------------------------------------------------------------- //
  
  async ngOnInit() 
  {
    let mail_de_sesion_actual = await this.srvAuth.sesionActual();

    if (mail_de_sesion_actual != undefined)
    {
      this.dataUsuarioLogeado = await this.srvAuth.obtenerDatosMailRecibido(mail_de_sesion_actual);
      this.tipoUsuarioLogeado = await this.dataUsuarioLogeado.tipo;
    }
    else
    {
      this.tipoUsuarioLogeado = 'anonimo';
    }
  }

}
