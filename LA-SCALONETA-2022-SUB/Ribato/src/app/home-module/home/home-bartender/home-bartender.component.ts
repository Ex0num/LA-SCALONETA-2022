import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-bartender',
  templateUrl: './home-bartender.component.html',
  styleUrls: ['./home-bartender.component.scss'],
})
export class HomeBartenderComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {}

  altaProducto()
  {
    this.router.navigateByUrl("alta-producto");
  }

  pedidosPendientesBartender()
  {
    this.router.navigateByUrl("pedidos-pendientes-bar");
  }
}
