import { Injectable } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';

//Datos importantes
const servicioRibato = "service_4ap5bgn";
const templateRibato = "template_idnal7m";
const publicKeyRibato = "xLKegu6O5tDsrng5k";
const mailRibato = "ribatorestaurante@gmail.com";

@Injectable({
  providedIn: 'root'
})
export class MailSendingService {

  constructor() {}

  enviarMail(correoUsuario:string, mensajeRedactado:string)
  {
    let templateParams = 
    {
      to_name: correoUsuario,
      message: mensajeRedactado,
      from_name: mailRibato
    };

    console.log("------ DATA: ---- ");
    console.log(templateParams.to_name);
    console.log(templateParams.message);
    console.log(templateParams.from_name);

    emailjs.send(servicioRibato, templateRibato, templateParams, publicKeyRibato)
      .then(res =>
      {
        console.log("Email enviado.", res.status, res.text);
      })
      .catch(error =>
      {
        console.log("Error al enviar el email.", error);
      });
  }

}
