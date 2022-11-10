import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AltaClienteComponent } from './alta-cliente/alta-cliente.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';


import { QRCodeModule } from 'angularx-qrcode';
import { AltaDuenoSupervisorComponent } from './alta-dueno-supervisor/alta-dueno-supervisor.component';
import { AltaEmpleadoComponent } from './alta-empleado/alta-empleado.component';
import { AltaMesaComponent } from './alta-mesa/alta-mesa.component';
import { AltaProductoComponent } from './alta-producto/alta-producto.component';


@NgModule({
  declarations: [AltaClienteComponent,AltaDuenoSupervisorComponent,AltaEmpleadoComponent,AltaMesaComponent,AltaProductoComponent],
  imports: [
    CommonModule,IonicModule,FormsModule, IonicModule.forRoot(),QRCodeModule
  ]
})
export class AltaModuleModule { }
