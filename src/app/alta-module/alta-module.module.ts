import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AltaClienteComponent } from './alta-cliente/alta-cliente.component';
import { AltaDuenoSupervisorComponent } from './alta-dueno-supervisor/alta-dueno-supervisor.component';
import { AltaMesaComponent } from './alta-mesa/alta-mesa.component';
import { AltaProductoComponent } from './alta-producto/alta-producto.component';

@NgModule({
  declarations: [AltaClienteComponent,AltaDuenoSupervisorComponent,AltaMesaComponent,AltaProductoComponent],
  imports: [
    CommonModule,IonicModule,FormsModule, IonicModule.forRoot()
  ]
})
export class AltaModuleModule { }
