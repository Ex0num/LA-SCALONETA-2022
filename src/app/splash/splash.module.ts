import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SplashComponent } from './splash/splash.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [SplashComponent],
  imports: [
    CommonModule, IonicModule.forRoot()
  ]
})
export class SplashModule { }
