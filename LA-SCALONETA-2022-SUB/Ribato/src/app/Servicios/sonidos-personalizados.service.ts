import { Injectable } from '@angular/core';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';

@Injectable({
  providedIn: 'root'
})
export class SonidosPersonalizadosService {


  constructor(private vibration:Vibration) {}

  public reproducirSonido(nombreArchivoRecibido : string, reprodudirSonido:boolean)
  {
    if (reprodudirSonido == true)
    {
      //let rutaAlFolder : string = '../../../assets/sonidos/';
      let rutaAlFolder : string = '../assets/sonidos/';
      let rutaCompletaAlArchivo = rutaAlFolder + nombreArchivoRecibido + ".mp3";
      console.log(rutaCompletaAlArchivo);

      if (nombreArchivoRecibido == "error")
      {
        this.reproducir(rutaCompletaAlArchivo);   
        this.vibration.vibrate(1500);
      }

      this.reproducir(rutaCompletaAlArchivo);  
    }        
  }

  private reproducir(rutaCompletaRecibida : string)
  {
    let audio = new Audio(rutaCompletaRecibida);
    audio.play();   
  }
}