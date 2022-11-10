import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-metre',
  templateUrl: './home-metre.component.html',
  styleUrls: ['./home-metre.component.scss'],
})
export class HomeMetreComponent implements OnInit {

  constructor(
    public router:Router,
  ) {}

  ngOnInit() {}

  altaCliente()
  {
    this.router.navigateByUrl("alta-cliente");
  }

  listaEspera()
  {
    this.router.navigateByUrl("clientes-esperando-mesa");
  }

}
