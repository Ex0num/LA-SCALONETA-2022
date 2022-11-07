import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SonidosPersonalizadosService {

  constructor() {}

  public reproducirSonido(nombreArchivoRecibido : string, reprodudirSonido:boolean)
  {
    if (reprodudirSonido == true)
    {
      let rutaAlFolder : string = '../../../assets/sonidos/';
      let rutaCompletaAlArchivo = rutaAlFolder + nombreArchivoRecibido + ".mp3";
      this.reproducir(rutaCompletaAlArchivo);   
    }        
  }

  private reproducir(rutaCompletaRecibida : string)
  {
    let audio = new Audio(rutaCompletaRecibida);
    audio.play();   
  }
}
