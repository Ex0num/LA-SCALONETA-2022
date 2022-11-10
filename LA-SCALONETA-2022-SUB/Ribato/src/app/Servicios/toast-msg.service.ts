import { Injectable } from '@angular/core';
import {ToastController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastMsgService {

  constructor(public toastController:ToastController) {}

  // ------------ Informacion de toast ---------------------
  /*
  position: top/middle/bottom
  message: 'mensaje a mostrarse'
  duration: duracion en ms.
  color: danger/success/light
  */
 //---------------------------------------------------------

 async mostrarToast(posicionRecibido:any, mensajeRecibido:string, duracionRecibido:number, colorRecibido:string)
 {
   const toast = await this.toastController.create(
   {
     position: posicionRecibido,
     message: mensajeRecibido,
     duration: duracionRecibido,
     color: colorRecibido,
   });

   if (toast.position == "top")
   {
     toast.style.width = "89%";
     toast.style.marginTop = "5%";
     toast.style.marginLeft = "5%";
   }
   else if (toast.position == "bottom")
   {
     toast.style.width = "89%";
     toast.style.marginLeft = "5%";
   }

   toast.style.fontFamily = "Georgia, 'Times New Roman', Times, serif";
   toast.style.fontSize = "17.5px";
  
   toast.present();
 }

}
