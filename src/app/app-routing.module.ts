import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AltaClienteComponent } from './alta-module/alta-cliente/alta-cliente.component';
import { LoginComponent } from './Vistas/login/login.component';

const routes: Routes = [
  {path: 'login',component:LoginComponent},
  {path: 'alta-cliente',component:AltaClienteComponent, loadChildren: () => import('./alta-module/alta-module.module').then(m => m.AltaModuleModule)},
  {path: '',redirectTo: 'login', pathMatch: 'full'},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
