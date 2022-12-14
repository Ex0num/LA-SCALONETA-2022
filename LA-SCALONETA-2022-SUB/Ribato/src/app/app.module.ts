import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideMessaging,getMessaging } from '@angular/fire/messaging';
import { provideStorage,getStorage } from '@angular/fire/storage';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';

import { LoginComponent } from './Vistas/login/login.component';
import { FormsModule } from '@angular/forms';
import { AprobarClienteComponent } from './Vistas/aprobar-cliente/aprobar-cliente.component';
import { FiltradorClientesPendientesPipe } from './Pipes/filtrador-clientes-pendientes.pipe';
import { ClientesEsperandoMesaComponent } from './Vistas/clientes-esperando-mesa/clientes-esperando-mesa.component';
import { FiltradorConsumidoresEsperandoPipe } from './Pipes/filtrador-consumidores-esperando.pipe';
import { FiltradorMesasDisponiblesPipe } from './Pipes/filtrador-mesas-disponibles.pipe';
import { ChatMozosComponent } from './Vistas/chat-mozos/chat-mozos.component';
import { FiltradorMensajariaPipe } from './Pipes/filtrador-mensajaria.pipe';

import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { MenuProductosComponent } from './Vistas/menu-productos/menu-productos.component';
import { PedidosEsperandoMozoComponent } from './Vistas/pedidos-esperando-mozo/pedidos-esperando-mozo.component';
import { FiltradorPedidosEsperandoPipe } from './Pipes/filtrador-pedidos-esperando.pipe';
import { CuentaGeneradaComponent } from './Vistas/cuenta-generada/cuenta-generada.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent,LoginComponent, AprobarClienteComponent, FiltradorClientesPendientesPipe, ClientesEsperandoMesaComponent, FiltradorConsumidoresEsperandoPipe, FiltradorMesasDisponiblesPipe,ChatMozosComponent, FiltradorMensajariaPipe, MenuProductosComponent,PedidosEsperandoMozoComponent, FiltradorPedidosEsperandoPipe, CuentaGeneradaComponent],
  imports: [BrowserModule, IonicModule.forRoot(), 
    FormsModule,
    AppRoutingModule,
    HttpClientModule, 
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireStorageModule,
    provideAuth(() => getAuth()), 
    provideDatabase(() => getDatabase()), 
    provideFirestore(() => getFirestore()), 
    provideMessaging(() => getMessaging()), 
    provideStorage(() => getStorage())],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },Vibration],
  bootstrap: [AppComponent],
})
export class AppModule {}
