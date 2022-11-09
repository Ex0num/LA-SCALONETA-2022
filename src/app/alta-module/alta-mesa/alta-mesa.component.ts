import { Component, OnInit } from '@angular/core';
import { CamaraFotosService } from 'src/app/Servicios/camara-fotos.service';
import { FirebaseService } from 'src/app/Servicios/firebase.service';
import { GeneradorQrService } from 'src/app/Servicios/generador-qr.service';

@Component({
  selector: 'app-alta-mesa',
  templateUrl: './alta-mesa.component.html',
  styleUrls: ['./alta-mesa.component.scss'],
})
export class AltaMesaComponent implements OnInit {

  constructor(
    public srvCamara:CamaraFotosService,
    public srvGeneradorQR:GeneradorQrService,
    public srvFirebase:FirebaseService
  ) {}

  infoQR

  async ngOnInit() 
  {
    let lastID = await this.srvFirebase.getLastIDMesas();
    lastID++;

    this.numeroGenerado_mesa = lastID;
    this.infoQR = "mesa_" + lastID.toString();

    setTimeout( async () => 
    {

      let b = document.getElementById("imagen-qr-deleteable");
      let urlPublic = await this.srvGeneradorQR.crearImagen(b);
      
      this.cargaQrFinalizada = true;
      
      let a = document.getElementById("imagen-qr");
      a.style.animation = "puff-in-center 1.2s cubic-bezier(0.470, 0.000, 0.745, 0.715) both";
      a.setAttribute("src",urlPublic);
      a.removeAttribute("hidden");

      document.getElementById("imagen-qr-deleteable").setAttribute("hidden","true");

      // let resultadoImg = await this.srvGeneradorQR.generarQR("probadnoQR");
      // document.getElementById("imagen-qr").setAttribute("src", await resultadoImg); 
    }, 800);  
  }

  //#region ------------------------ Atributos ---------------------------------
  public sonidoActivado:boolean = true;

  public numero_mesa;
  public cantidadComensales_mesa;
  public tipo_mesa = "estandar";
  public foto_mesa;

  //Este numero se carga en cuestion del ultimo numero de mesa detectado en la DB.
  //El usuario no puede interactuar.
  public numeroGenerado_mesa;

  cargaQrFinalizada = false;

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

  registrarMesa()
  {
    console.log("SUBIENDO MESA");
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
