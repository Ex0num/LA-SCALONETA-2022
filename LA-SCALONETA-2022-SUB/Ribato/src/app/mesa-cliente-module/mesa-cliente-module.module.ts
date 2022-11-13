import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MesaHomeComponent } from './mesa-home/mesa-home.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [MesaHomeComponent],
  imports: [
    CommonModule, IonicModule.forRoot()
  ]
})
export class MesaClienteModuleModule { }
