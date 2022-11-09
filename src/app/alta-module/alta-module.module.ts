import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AltaClienteComponent } from './alta-cliente/alta-cliente.component';
import { AltaDuenoSupervisorComponent } from './alta-dueno-supervisor/alta-dueno-supervisor.component';
import { AltaMesaComponent } from './alta-mesa/alta-mesa.component';
import { AltaProductoComponent } from './alta-producto/alta-producto.component';
import { AltaEmpleadoComponent } from './alta-empleado/alta-empleado.component';

import { QRCodeModule } from 'angularx-qrcode';
import html2canvas from "html2canvas";

@NgModule({
  declarations: [AltaClienteComponent,AltaDuenoSupervisorComponent,AltaMesaComponent,AltaProductoComponent,AltaEmpleadoComponent],
  imports: [
    CommonModule,IonicModule,FormsModule, IonicModule.forRoot(),QRCodeModule
  ]
})
export class AltaModuleModule { }
