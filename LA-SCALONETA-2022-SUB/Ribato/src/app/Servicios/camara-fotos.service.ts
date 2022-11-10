import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class CamaraFotosService 
  {

    constructor() {}
  
    public async abrirCamaraDeFotos() 
    {
        //Saca la foto
        const capturedPhoto = await Camera.getPhoto({
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Camera,
          quality: 100,
          webUseInput: true,
        });
  
        return capturedPhoto;
    }
    
  }
