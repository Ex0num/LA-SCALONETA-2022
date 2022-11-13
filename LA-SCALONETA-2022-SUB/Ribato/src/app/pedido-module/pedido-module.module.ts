import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidosPendientesBarComponent } from './pedidos-pendientes-bar/pedidos-pendientes-bar.component';
import { PedidosPendientesCocinaComponent } from './pedidos-pendientes-cocina/pedidos-pendientes-cocina.component';
import { IonicModule } from '@ionic/angular';
import { RealizarPedidoComponent } from './realizar-pedido/realizar-pedido.component';
import { FiltradorPedidosEnPreparacionCocinaPipe } from '../Pipes/filtrador-pedidos-en-preparacion-cocina.pipe';
import { FiltradorPedidosEnPreparacionBarPipe } from '../Pipes/filtrador-pedidos-en-preparacion-bar.pipe';
import { ClientesEsperandoPedidoComponent } from './clientes-esperando-pedido/clientes-esperando-pedido.component';
import { TransformadorEstadoPedidoPipe } from '../Pipes/transformador-estado-pedido.pipe';
import { PedidosEsperandoRespuestaMozoComponent } from './pedidos-esperando-respuesta-mozo/pedidos-esperando-respuesta-mozo.component';
import { FiltradorPedidosEsperandoRespuestaPipe } from '../Pipes/filtrador-pedidos-esperando-respuesta.pipe';
// import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [PedidosPendientesBarComponent, PedidosPendientesCocinaComponent, RealizarPedidoComponent, FiltradorPedidosEnPreparacionCocinaPipe, FiltradorPedidosEnPreparacionBarPipe, ClientesEsperandoPedidoComponent, TransformadorEstadoPedidoPipe, PedidosEsperandoRespuestaMozoComponent,FiltradorPedidosEsperandoRespuestaPipe],
  imports: [
    CommonModule, IonicModule
  ]
})
export class PedidoModuleModule { }
