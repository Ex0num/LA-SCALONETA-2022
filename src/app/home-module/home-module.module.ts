import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { HomeCocineroComponent } from './home/home-cocinero/home-cocinero.component';
import { IonicModule } from '@ionic/angular';
import { HomeBartenderComponent } from './home/home-bartender/home-bartender.component';
import { HomeClienteComponent } from './home/home-cliente/home-cliente.component';
import { HomeMetreComponent } from './home/home-metre/home-metre.component';
import { HomeMozoComponent } from './home/home-mozo/home-mozo.component';
import { HomeDuenoSupervisorComponent } from './home/home-dueno-supervisor/home-dueno-supervisor.component';

@NgModule({
  declarations: [HomeComponent,HomeBartenderComponent,HomeClienteComponent,HomeCocineroComponent,HomeMetreComponent,HomeMozoComponent,HomeDuenoSupervisorComponent],
  imports: [
    CommonModule,  IonicModule.forRoot(),
  ]
})
export class HomeModuleModule { }
