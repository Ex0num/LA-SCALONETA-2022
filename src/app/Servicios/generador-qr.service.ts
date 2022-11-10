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

  // convertURLToImageData(URL:any) 
  // {
  //   return new Promise(function(resolve, reject) 
  //   {
  //     if (URL == null) return reject();
  //     var canvas = document.createElement('canvas'),
  //         context = canvas.getContext('2d'),
  //         image = new Image();

  //     image.addEventListener('load', function() 
  //     {
  //       canvas.width = image.width;
  //       canvas.height = image.height;
  //       context.drawImage(image, 0, 0, canvas.width, canvas.height);

  //       resolve(context.getImageData(0, 0, canvas.width, canvas.height));

  //     }, false);

  //     image.src = URL;
  //   });
  // }

  async convertURLtoFile(url:string)
  {
    let res = await fetch(url);
    let buf = await res.arrayBuffer();
    let file = new File([buf], "probando.jpg", { type: 'image/jpeg' });
    return file;
  }

  convertURLToImageData = (url) => 
  {
    return new Promise((resolve, reject) => 
    {

      if (!url) 
      {
        return reject();
      }

      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      const image = new Image();

      image.onload = () => 
      {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(context.getImageData(0, 0, canvas.width, canvas.height));
      }

      image.crossOrigin = "Anonymous";
      image.src = url;

      return image;
    });
  }

  // var URI = "data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAQAQAABMLAAATCwAAAAAAAAAAAABsiqb/bIqm/2yKpv9siqb/bIqm/2yKpv9siqb/iKC3/2yKpv9siqb/bIqm/2yKpv9siqb/bIqm/2yKpv9siqb/bIqm/2yKpv9siqb/bIqm/2yKpv9siqb/2uLp///////R2uP/dZGs/2yKpv9siqb/bIqm/2yKpv9siqb/bIqm/2yKpv9siqb/bIqm/2yKpv9siqb/bIqm/////////////////+3w9P+IoLf/bIqm/2yKpv9siqb/bIqm/2yKpv9siqb/bIqm/2yKpv9siqb/bIqm/2yKpv///////////+3w9P+tvc3/dZGs/2yKpv9siqb/bIqm/2yKpv9siqb/TZbB/02Wwf9NlsH/TZbB/02Wwf9NlsH////////////0+Pv/erDR/02Wwf9NlsH/TZbB/02Wwf9NlsH/TZbB/02Wwf9NlsH/TZbB/02Wwf9NlsH/TZbB//////////////////////96sNH/TZbB/02Wwf9NlsH/TZbB/02Wwf9NlsH/TZbB/02Wwf9NlsH/TZbB/02Wwf////////////////+Ft9T/TZbB/02Wwf9NlsH/TZbB/02Wwf9NlsH/E4zV/xOM1f8TjNX/E4zV/yKT2P/T6ff/////////////////4fH6/z+i3f8TjNX/E4zV/xOM1f8TjNX/E4zV/xOM1f8TjNX/E4zV/xOM1f+m1O/////////////////////////////w+Pz/IpPY/xOM1f8TjNX/E4zV/xOM1f8TjNX/E4zV/xOM1f8TjNX////////////T6ff/Tqng/6bU7////////////3u/5/8TjNX/E4zV/xOM1f8TjNX/AIv//wCL//8Ai///AIv/////////////gMX//wCL//8gmv////////////+Axf//AIv//wCL//8Ai///AIv//wCL//8Ai///AIv//wCL///v+P///////+/4//+Axf//z+n/////////////YLf//wCL//8Ai///AIv//wCL//8Ai///AIv//wCL//8Ai///gMX/////////////////////////////z+n//wCL//8Ai///AIv//wCL//8Ai///AHr//wB6//8Aev//AHr//wB6//+Avf//7/f/////////////v97//xCC//8Aev//AHr//wB6//8Aev//AHr//wB6//8Aev//AHr//wB6//8Aev//AHr//wB6//8Aev//AHr//wB6//8Aev//AHr//wB6//8Aev//AHr//wB6//8Aev//AHr//wB6//8Aev//AHr//wB6//8Aev//AHr//wB6//8Aev//AHr//wB6//8Aev//AHr//wB6//8Aev//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==";
  // convertURIToImageData(URI).then(function(imageData) {
  //   // Here you can use imageData
  //   console.log(imageData);
  // });
}
