import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class GeneradorQrService 
{
  constructor() {}

  // --------------- ESTRUCTURA BASICA DE 'qrcode' en HTML -----------------------//
  //
  // 'qrdata' lleva toda la información en string que se desea almacenar.
  //
  //  <div class="imagen-formulario" id="imagen-qr-deleteable">
  //      <qrcode [qrdata]='infoQR' id="my-qr"></qrcode>
  //  </div>
  //
  // Nota: Recordar importar en 'imports' QRCodeModule en el módulo correspondiente.
  //
  //#region Estructura completa de un elemento <qrcode></qrcode>
  //
  // <div class="imagen-formulario" id="imagen-qr">
  //      <qrcode id="my-qr" 
  //          [qrdata]="infoQR"                                               
  //          [width]="400" 
  //          [errorCorrectionLevel]="'M'"
  //          [allowEmptyString]="true"
  //          [cssClass]="'center'"
  //          [colorDark]="'#000000ff'"
  //          [colorLight]="'#ffffffff'"
  //          [elementType]="'img'"
  //          [margin]="2"
  //          [scale]="1">
  //      </qrcode>
  //  </div>
  //
  //#endregion
  //
  // ------------------------------------------------------------------------------//

  //Crea un link publico de imagen correspondiente al elemento html que le hayamos pasado.
  async crearImagen(elementoHTMLRecibido:any) 
  {
    let imagenCreadaURL;

    await html2canvas(elementoHTMLRecibido).then(canvas => 
    {
      imagenCreadaURL = canvas.toDataURL();     
    });
    
    return imagenCreadaURL;
  }
}
