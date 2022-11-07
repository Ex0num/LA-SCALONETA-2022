import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AltaClienteComponent } from './alta-cliente/alta-cliente.component';



@NgModule({
  declarations: [AltaClienteComponent],
  imports: [
    CommonModule,IonicModule,FormsModule
  ]
})
export class AltaModuleModule { }
