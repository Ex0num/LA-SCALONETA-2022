import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-mozo',
  templateUrl: './home-mozo.component.html',
  styleUrls: ['./home-mozo.component.scss'],
})
export class HomeMozoComponent implements OnInit {

  constructor(private router: Router, ) { }

  ngOnInit() {}

  responderConsultas()
  {
    this.router.navigateByUrl("chat-mozos");
  }

  listadoMesas()
  {
    // this.router.navigateByUrl("chat-mozos");
  }

  menu()
  {
    this.router.navigateByUrl("menu-productos");
  }

  pedidosEnEspera()
  {
    this.router.navigateByUrl("pedidos-esperando-mozo");
  }

  pedidosDelMozo()
  {
    this.router.navigateByUrl("pedidos-esperando-respuesta-mozo");
  }

}
