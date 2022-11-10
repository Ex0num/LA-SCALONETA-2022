import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Servicios/auth.service';

@Component({
  selector: 'app-home-dueno-supervisor',
  templateUrl: './home-dueno-supervisor.component.html',
  styleUrls: ['./home-dueno-supervisor.component.scss'],
})
export class HomeDuenoSupervisorComponent implements OnInit {

  constructor(
  private router: Router, 
  public srvAuth:AuthService) {}

  async ngOnInit() 
  {}

  altaEmpleado()
  {
    this.router.navigateByUrl("alta-empleado");
  }

  altaSupervisorDueno()
  {
    this.router.navigateByUrl("alta-dueno-supervisor");
  }

  altaMesa()
  {
    // //Apenas se toca el boton de "alta mesa", ya le indico al componente que va a tener que iniciar la generacion QR.
    // AltaMesaComponent.prototype.generacionQR = true;
    this.router.navigateByUrl("alta-mesa");
  }

  aprobacionClientes()
  {
    this.router.navigateByUrl("aprobar-clientes");
  }

}