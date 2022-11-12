import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidosPendientesBarComponent } from './pedidos-pendientes-bar/pedidos-pendientes-bar.component';
import { PedidosPendientesCocinaComponent } from './pedidos-pendientes-cocina/pedidos-pendientes-cocina.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [PedidosPendientesBarComponent, PedidosPendientesCocinaComponent],
  imports: [
    CommonModule, IonicModule
  ]
})
export class PedidoModuleModule { }
