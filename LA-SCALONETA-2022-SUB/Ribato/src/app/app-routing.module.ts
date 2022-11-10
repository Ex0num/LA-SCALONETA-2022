import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AltaClienteComponent } from './alta-module/alta-cliente/alta-cliente.component';
import { AltaDuenoSupervisorComponent } from './alta-module/alta-dueno-supervisor/alta-dueno-supervisor.component';
import { AltaEmpleadoComponent } from './alta-module/alta-empleado/alta-empleado.component';
import { AltaMesaComponent } from './alta-module/alta-mesa/alta-mesa.component';
import { AltaProductoComponent } from './alta-module/alta-producto/alta-producto.component';
import { HomeBartenderComponent } from './home-module/home/home-bartender/home-bartender.component';
import { HomeClienteComponent } from './home-module/home/home-cliente/home-cliente.component';
import { HomeCocineroComponent } from './home-module/home/home-cocinero/home-cocinero.component';
import { HomeDuenoSupervisorComponent } from './home-module/home/home-dueno-supervisor/home-dueno-supervisor.component';
import { HomeMetreComponent } from './home-module/home/home-metre/home-metre.component';
import { HomeMozoComponent } from './home-module/home/home-mozo/home-mozo.component';
import { HomeComponent } from './home-module/home/home.component';
import { SplashComponent } from './splash/splash/splash.component';
import { AprobarClienteComponent } from './Vistas/aprobar-cliente/aprobar-cliente.component';
import { LoginComponent } from './Vistas/login/login.component';

const routes: Routes = [

 //Paginas iniciales/normales
  {path: 'splash',component:SplashComponent,  loadChildren: () => import('./splash/splash.module').then(m => m.SplashModule)},
  {path: 'login',component:LoginComponent},
  {path: 'aprobar-clientes',component:AprobarClienteComponent},
  // {path: 'clientes-esperando-mesa',component:ClientesEsperandoMesaComponent},

  // //Modulo de alta (Tipos de usuarios)
  {path: 'alta-cliente',component:AltaClienteComponent, loadChildren: () => import('./alta-module/alta-module.module').then(m => m.AltaModuleModule)},
  {path: 'alta-dueno-supervisor',component:AltaDuenoSupervisorComponent, loadChildren: () => import('./alta-module/alta-module.module').then(m => m.AltaModuleModule)},
  {path: 'alta-empleado',component:AltaEmpleadoComponent, loadChildren: () => import('./alta-module/alta-module.module').then(m => m.AltaModuleModule)},
  //Modulo de alta (Objetos)
  {path: 'alta-mesa',component:AltaMesaComponent, loadChildren: () => import('./alta-module/alta-module.module').then(m => m.AltaModuleModule)},
  {path: 'alta-producto',component:AltaProductoComponent, loadChildren: () => import('./alta-module/alta-module.module').then(m => m.AltaModuleModule)},
  
  // //Modulo de homes
  {path: 'home',component:HomeComponent, loadChildren: () => import('./home-module/home-module.module').then(m => m.HomeModuleModule)},
  {path: 'home-bartender',component:HomeBartenderComponent, loadChildren: () => import('./home-module/home-module.module').then(m => m.HomeModuleModule)},
  {path: 'home-cliente',component:HomeClienteComponent, loadChildren: () => import('./home-module/home-module.module').then(m => m.HomeModuleModule)},
  {path: 'home-cocinero',component:HomeCocineroComponent, loadChildren: () => import('./home-module/home-module.module').then(m => m.HomeModuleModule)},
  {path: 'home-metre',component:HomeMetreComponent, loadChildren: () => import('./home-module/home-module.module').then(m => m.HomeModuleModule)},
  {path: 'home-mozo',component:HomeMozoComponent, loadChildren: () => import('./home-module/home-module.module').then(m => m.HomeModuleModule)},
  {path: 'home-dueno-supervisor',component:HomeDuenoSupervisorComponent, loadChildren: () => import('./home-module/home-module.module').then(m => m.HomeModuleModule)},

  //Paginas redirectoras
  {path: '',redirectTo: 'login', pathMatch: 'full'},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
