import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CamaraFotosService } from 'src/app/Servicios/camara-fotos.service';
import { FirebaseService } from 'src/app/Servicios/firebase.service';
import { GeneradorQrService } from 'src/app/Servicios/generador-qr.service';
import { SonidosPersonalizadosService } from 'src/app/Servicios/sonidos-personalizados.service';
import { ToastMsgService } from 'src/app/Servicios/toast-msg.service';

@Component({
  selector: 'app-alta-mesa',
  templateUrl: './alta-mesa.component.html',
  styleUrls: ['./alta-mesa.component.scss'],
})
export class AltaMesaComponent implements OnInit {

  constructor(
    public srvCamara:CamaraFotosService,
    public srvGeneradorQR:GeneradorQrService,
    public srvFirebase:FirebaseService,
    public srvToast:ToastMsgService, 
    public srvSonidos:SonidosPersonalizadosService,
    public router:Router
  ) {}

  ngOnInit() 
  {
   
    setTimeout( () => 
    {
      this.setearDataQR();
      
      setTimeout(() => 
      {
        this.obtenerSetearImagenQR();
      }, 2500);
          
    },1000);  
  }

  //#region ------------------------ Atributos ---------------------------------
  public sonidoActivado:boolean = true;

  //Este numero se carga en cuestion del ultimo numero de mesa detectado en la DB.
  //El usuario no puede interactuar.
  public numeroGenerado_mesa;
  public cantidadComensales_mesa;
  public tipo_mesa = "estandar";
  public foto_mesa;
  public foto_mesaQR;



  cargaQrFinalizada = false;

  //Atributos necesario para el <qrcode>
  public infoQR;
  public emptyString = true;

  //#endregion -------------------------------------------------------------------

  //------------------ Funciones generales ---------------------
  public async abrirCamara()
  {
    //Aca muestro la foto que sacó la camara
    let elementoHTML_fotoCamara = document.getElementById("imagen-camara");

    //Obtengo la foto y su URL para setearla
    let image:any =  await this.srvCamara.abrirCamaraDeFotos();
    let imageURL:any = await image.dataUrl;

    if (await image != undefined)
    {
      elementoHTML_fotoCamara.setAttribute("src", await imageURL);
      this.foto_mesa = await imageURL;
    }
    else
    {
      //Si no hay foto asigno una foto en blanco.
      elementoHTML_fotoCamara.setAttribute("src","../../../assets/files/example-foto.PNG");
    }
  }

  actualizarTipoMesa(event:any)
    {
      this.tipo_mesa = event.target.value;

      switch (this.tipo_mesa) 
      {
        case 'VIP':
        {
          this.tipo_mesa = "vip";
          break;
        }
        case 'Discapacitados':
        {
          this.tipo_mesa = "discapacitados";
          break;
        }
        case 'Estándar':
        {
          this.tipo_mesa = "estandar";
          break;
        }
      }

      console.log(this.tipo_mesa);
  }

  async registrarMesa()
  {
    if (this.cantidadComensales_mesa < 40 && this.foto_mesa != undefined && this.cantidadComensales_mesa > 0 && this.cantidadComensales_mesa != undefined)
    {
        console.log(this.foto_mesa);
        console.log(this.foto_mesaQR);

        this.srvFirebase.alta_mesa(
        this.numeroGenerado_mesa,
        this.cantidadComensales_mesa,
        this.tipo_mesa,
        this.foto_mesaQR,
        this.foto_mesa); 

        //Acciones finales
        this.srvToast.mostrarToast("bottom","La mesa fue creada satisfactoriamente.",3000,"success");
        this.srvSonidos.reproducirSonido("slide",this.sonidoActivado);  
        this.limpiarDatosMesa();
        
        setTimeout(() => 
        {
          this.router.navigateByUrl("home");
        }, 800);  
    }
    else
    {
      console.log("Datos inválidos");

      if (this.cantidadComensales_mesa > 40)
      {
        this.srvToast.mostrarToast("bottom","La cantidad de comensales no puede ser superior a 40 en una mesa. Revise lo que ingresó.",3000,"danger");
      }
      else if (this.cantidadComensales_mesa < 1)
      {
        this.srvToast.mostrarToast("bottom","La cantidad de comensales no puede ser menor a 1 en una mesa. Revise lo que ingresó.",3000,"danger");
      }
      else if (this.cantidadComensales_mesa == undefined)
      {
        this.srvToast.mostrarToast("bottom","La cantidad de comensales no puede ser inexistente. Revise lo que ingresó.",3000,"danger");
      }
      else if (this.foto_mesa == undefined)
      {
        this.srvToast.mostrarToast("bottom","La foto de la mesa no puede ser inexistente.",3000,"danger");
      }

      this.srvSonidos.reproducirSonido("error",this.sonidoActivado);
    }
  }

  //Busca el ultimo numero de mesa y le hace ++ para asignarlo a esta nueva mesa
  public async setearDataQR()
  {
    let lenghtMesas = this.srvFirebase.mesas.length;
    lenghtMesas++;

    //Info para el QR y para la mesa
    this.infoQR = lenghtMesas.toString();
    this.numeroGenerado_mesa = lenghtMesas.toString();
  }

  public async obtenerSetearImagenQR()
  {
      //Luego de que el QR se haya generado saco la foto rapidamente y lo cargo al HTMLElement IMG escondiendo el elemento <qrcode>
      let elementoHTMLQR = document.getElementById("imagen-qr-deleteable");
      let urlPublic = await this.srvGeneradorQR.crearImagen(elementoHTMLQR);
      
      // this.cargaQrFinalizada = true;
      
      // let elementoHTMLImagenQR = document.getElementById("imagen-qr");
      // elementoHTMLImagenQR.style.animation = "puff-in-center 1.2s cubic-bezier(0.470, 0.000, 0.745, 0.715) both";
      // elementoHTMLImagenQR.setAttribute("src",urlPublic);
      // elementoHTMLImagenQR.removeAttribute("hidden");

      this.foto_mesaQR = urlPublic;

      // document.getElementById("imagen-qr-deleteable").setAttribute("hidden","true");
  }

  private limpiarDatosMesa()
  {
    this.cantidadComensales_mesa = undefined;
    
    //Se "limpia" el archivo subido tmb
    this.foto_mesa = undefined;

    let elementoHTMLImagenQR = document.getElementById("imagen-qr");
    elementoHTMLImagenQR.setAttribute("src","../../../assets/files/example-foto.PNG");
  }

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
  //-------------------------------------------------------------
  

}
