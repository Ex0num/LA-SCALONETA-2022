import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Servicios/auth.service';
import { FirebaseService } from 'src/app/Servicios/firebase.service';
import { ScannerQrService } from 'src/app/Servicios/scanner-qr.service';
import { SonidosPersonalizadosService } from 'src/app/Servicios/sonidos-personalizados.service';
import { ToastMsgService } from 'src/app/Servicios/toast-msg.service';

@Component({
  selector: 'app-alta-dueno-supervisor',
  templateUrl: './alta-dueno-supervisor.component.html',
  styleUrls: ['./alta-dueno-supervisor.component.scss'],
})
export class AltaDuenoSupervisorComponent implements OnInit {

  constructor(
    public srvToast:ToastMsgService, 
    public srvSonidos:SonidosPersonalizadosService,
    public router:Router,
    public srvLectorQR:ScannerQrService,
    public srvFirebase:FirebaseService,
    public srvAuth:AuthService,
    ) {}

  ngOnInit() {}

  //#region ------------------------ Atributos ----------------------------
  public sonidoActivado:boolean = true;

  //Datos supervisor/dueño
  public correo_autoridad:string;
  public password_autoridad:string;
  public passwordConfirmada_autoridad:string;
  public nombre_autoridad:string;
  public apellidos_autoridad:string;
  public dni_autoridad:number;
  public cuil_autoridad:string;
  public foto_autoridad:string;

  //#endregion -------------------------------------------------------------


  //------------------ Funciones generales ---------------------
  public async registarAutoridad()
  {
    if (this.correo_autoridad != undefined && this.correo_autoridad != "")
    {
      //Valido datos.
      let datoInvalido = this.srvFirebase.validar_autoridad(
      this.correo_autoridad,
      this.password_autoridad,
      this.passwordConfirmada_autoridad,
      this.nombre_autoridad,
      this.apellidos_autoridad,
      this.dni_autoridad,
      this.cuil_autoridad,
      this.foto_autoridad);
      //let datoInvalido = "ninguno"

      //Me fijo resultado y actuo en consecuencia
      if (datoInvalido == "ninguno")
      {
        console.log("Datos validos");
  
        let resultadoRegistro = await this.srvAuth.register(this.correo_autoridad, this.password_autoridad, this.sonidoActivado);
        //let resultadoRegistro = "ok";
  
        if (resultadoRegistro != undefined)
        {
          this.srvFirebase.alta_autoridad(
          this.correo_autoridad,
          this.password_autoridad,
          this.nombre_autoridad,
          this.apellidos_autoridad,
          this.dni_autoridad,
          this.cuil_autoridad,
          this.foto_autoridad); 
        
          //Acciones finales
          this.srvToast.mostrarToast("bottom","La cuenta fue creada satisfactoriamente.",3000,"success");
          this.srvSonidos.reproducirSonido("slide",this.sonidoActivado);  
          this.limpiarDatosAutoridad();
          
          setTimeout(() => 
          {
            this.router.navigateByUrl("home");
          }, 800);
        
        }
      }
      else
      {
        console.log("Datos invalidos");
        this.srvToast.mostrarToast("bottom","El/la " + datoInvalido + " es un dato invalido. Verifiquelo por favor.",3000,"danger");
        this.srvSonidos.reproducirSonido("error",this.sonidoActivado);
      } 
    }
    else
    {
      console.log("Datos incompletos");
      this.srvToast.mostrarToast("bottom","Hay datos incompletos. Revise lo que ingresó.",3000,"danger");
      this.srvSonidos.reproducirSonido("error",this.sonidoActivado);
    }
  }

  private limpiarDatosAutoridad()
  {
    this.correo_autoridad = "";
    this.password_autoridad = "";
    this.passwordConfirmada_autoridad = "";
    this.nombre_autoridad = "";
    this.apellidos_autoridad = "";
    this.dni_autoridad = undefined;
    
    //Se "limpia" el archivo subido tmb.
    document.getElementById("file-name-autoridad").innerHTML = "";
  }

  public escenarDNI()
  {
    //Leo el QR y el contenido devuelto lo cargo al formulario.
    this.srvLectorQR.openScan().then((stringObtenido)=>
    {
      let contenidoLeido = stringObtenido.split('@');

      this.apellidos_autoridad = contenidoLeido[1].charAt(0) + contenidoLeido[1].slice(1).toLocaleLowerCase();
      this.nombre_autoridad  = contenidoLeido[2].charAt(0) + contenidoLeido[2].slice(1).toLocaleLowerCase();
      this.dni_autoridad  = parseInt(contenidoLeido[4]);

      //Detengo el scanner.
      this.srvLectorQR.stopScan();
    });
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

  // --------- Uploads de archivos (en los inputs) ---------------
  public archivoAutoridadSubido(event:any)
  {
    let fileList = event.target.files;
    console.log(fileList[0]);


      if (fileList[0] != undefined)
      {
        //Se setea al atributo de la autoridad
        this.foto_autoridad = fileList[0]; 
        document.getElementById("file-name-autoridad").innerHTML =  fileList[0].name; 
      }
      else
      {
        //Sino, el texto mostrado pasa a ser vacio.
        document.getElementById("file-name-autoridad").innerHTML = "";
      }
  }
  //-------------------------------------------------------------
 

}