import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-cocinero',
  templateUrl: './home-cocinero.component.html',
  styleUrls: ['./home-cocinero.component.scss'],
})
export class HomeCocineroComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {}

  altaProducto()
  {
    this.router.navigateByUrl("alta-producto");
  }

  pedidosPendientesCocinero()
  {
    this.router.navigateByUrl("pedidos-pendientes-cocina");
  }

}
