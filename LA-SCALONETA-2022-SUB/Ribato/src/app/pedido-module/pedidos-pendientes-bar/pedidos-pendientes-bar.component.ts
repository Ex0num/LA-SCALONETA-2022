import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Servicios/auth.service';
import { FirebaseService } from 'src/app/Servicios/firebase.service';

@Component({
  selector: 'app-pedidos-pendientes-bar',
  templateUrl: './pedidos-pendientes-bar.component.html',
  styleUrls: ['./pedidos-pendientes-bar.component.scss'],
})
export class PedidosPendientesBarComponent implements OnInit {

  constructor(
    public srvAuth:AuthService, 
    public srvFirebase:FirebaseService,
    public router:Router 
  ) {}

  ngOnInit() {}

  //------------------------ Atributos ---------------------------- //

  sonidoActivado:boolean = true;
  spinnerMostrandose:boolean = true;

  //------------- Funcionamiento de sonido --------------------------
  switchearEstadoSonido()
  {
    this.sonidoActivado = !this.sonidoActivado;
    let iconoSonido = document.getElementById("icono-sonido-pedidosPendientesBar");

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
