import { Component, OnInit } from '@angular/core';
import { ScannerQrService } from 'src/app/Servicios/scanner-qr.service';
import { SonidosPersonalizadosService } from 'src/app/Servicios/sonidos-personalizados.service';
import { ToastMsgService } from 'src/app/Servicios/toast-msg.service';
import { HomeComponent } from '../home.component';

@Component({
  selector: 'app-home-cliente',
  templateUrl: './home-cliente.component.html',
  styleUrls: ['./home-cliente.component.scss'],
})
export class HomeClienteComponent implements OnInit {

  constructor(
    public srvLectorQR:ScannerQrService,
    public srvToast:ToastMsgService, 
    public srvSonidos:SonidosPersonalizadosService,
  ) { }

  ngOnInit() {}

  //#region ------------------------ Atributos ---------------------------------
  clienteEnListaDeEspera = false;

  //#endregion -------------------------------------------------------------------

  //------------------ Funciones generales ---------------------

  public escenarQR_Ingreso()
  {
    //Leo el QR y el contenido devuelto lo cargo al formulario.
    this.srvLectorQR.openScan().then((stringObtenido)=>
    {
      let contenidoLeido = stringObtenido;

      //Detengo el scanner.
      this.srvLectorQR.stopScan();

      if (contenidoLeido == "ingreso_local")
      {
        this.srvToast.mostrarToast("bottom","El ingreso al local fue satisfactorio. Espere a ser asignado una mesa.",2500,"success");
        this.srvSonidos.reproducirSonido("bubble", HomeComponent.prototype.sonidoActivado);
        this.clienteEnListaDeEspera = true;

        //Aca envio el push notification al METRE. Hay un nuevo cliente en la lista de espera
        // TO DO
        //----------------------------

      }
      else
      {
        this.srvToast.mostrarToast("bottom","El QR analizado no corresponde al ingreso al local.",2500,"danger");
        this.srvSonidos.reproducirSonido("error", HomeComponent.prototype.sonidoActivado);
      }
    });
  }

  testing()
  {
    this.srvToast.mostrarToast("bottom","El ingreso al local fue satisfactorio. Espere a ser asignado una mesa.",2500,"success");
    this.clienteEnListaDeEspera = true;
  }
}
