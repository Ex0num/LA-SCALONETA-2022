import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-mozos',
  templateUrl: './chat-mozos.component.html',
  styleUrls: ['./chat-mozos.component.scss'],
})
export class ChatMozosComponent implements OnInit {

  constructor() { }

  ngOnInit() 
  {
    setTimeout(() => 
    {
      this.spinnerMostrandose = false;
    },2000);
  }

  //#region ------------------------ Atributos ----------------------------
  public sonidoActivado:boolean = true;
  public spinnerMostrandose = true;

  //#endregion ----------------------------------------------------------//


  // ------------- Funcionamiento de sonido ----------------------//
  public switchearEstadoSonido()
  {
    this.sonidoActivado = !this.sonidoActivado;
    let iconoSonido = document.getElementById("icono-sonido-altaAutoridad");
    
    if (this.sonidoActivado == true)
    {
      iconoSonido.setAttribute("name","volume-mute");
    }
    else
    {
      iconoSonido.setAttribute("name","radio");
    }
  }
  //--

}
