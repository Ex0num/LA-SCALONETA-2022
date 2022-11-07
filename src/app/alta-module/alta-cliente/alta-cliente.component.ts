import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Servicios/auth.service';
import { FirebaseService } from 'src/app/Servicios/firebase.service';
import { ScannerQRService } from 'src/app/Servicios/scanner-qr.service';
import { SonidosPersonalizadosService } from 'src/app/Servicios/sonidos-personalizados.service';
import { ToastMsgService } from 'src/app/Servicios/toast-msg.service';

@Component({
  selector: 'app-alta-cliente',
  templateUrl: './alta-cliente.component.html',
  styleUrls: ['./alta-cliente.component.scss'],
})
export class AltaClienteComponent implements OnInit {

  constructor(
    public srvToast:ToastMsgService, 
    public srvSonidos:SonidosPersonalizadosService,
    public router:Router,
    public srvLectorQR:ScannerQRService,
    public srvFirebase:FirebaseService,
    public srvAuth:AuthService) 
  {}

  ngOnInit() {}

  //#region ------------------------ Atributos ----------------------------
  public sonidoActivado:boolean = true;

  //Vale sí o no dependiendo lo que seleccionó
  public esRegistroAnonimo = undefined;
  public fotosHabilitadas = true;

  // --- DatosClienteNormal ---
  public nombre_clienteNormal:string;
  public apellidos_clienteNormal:string;
  public dni_clienteNormal:number;
  public correo_clienteNormal:string;
  public password_clienteNormal:string;
  public passwordConfirmada_clienteNormal:string;
  public foto_clienteNormal:any;

  // --- DatosClienteAnonimo ---
  public nombre_clienteAnonimo:string;
  public foto_clienteAnonimo:any;
  
  //#endregion -------------------------------------------------------------

  //#region ------------------ Funciones generales ---------------------
  private limpiarDatosClienteNormal()
  {
    this.correo_clienteNormal = "";
    this.password_clienteNormal = "";
    this.passwordConfirmada_clienteNormal = "";
    this.nombre_clienteNormal = "";
    this.apellidos_clienteNormal = "";
    this.dni_clienteNormal = undefined;
    
    //Se "limpia" el archivo subido tmb.
    document.getElementById("file-name-CliNormal").innerHTML = "";
  }

  //Muestra el formulario correspondiente en cuestion de lo que se selecciono al principio de la pag. (Cliente normal o anon)
  public mostrarRegistro(tipoRegistroRecibido:string)
  {
    if(this.sonidoActivado == true)
    {
      this.srvSonidos.reproducirSonido("slide",true);
    }

    let imagenRegistroEmpleadoNormal = document.getElementById("selector-registro-normal");
    let imagenRegistroEmpleadoAnonimo = document.getElementById("selector-registro-anonimo");

    imagenRegistroEmpleadoNormal.style.animation = "slide-out-left 1s cubic-bezier(0.550, 0.085, 0.680, 0.530) both";
    imagenRegistroEmpleadoAnonimo.style.animation = "slide-out-left 1s cubic-bezier(0.550, 0.085, 0.680, 0.530) both";
    
    setTimeout(() => 
    {

      this.fotosHabilitadas = false;

      if (tipoRegistroRecibido == "normal")
      {
        this.esRegistroAnonimo = false; 
      }
      else if (tipoRegistroRecibido == "anonimo")
      {
        this.esRegistroAnonimo = true;
      }

    }, 1000);
    
  }
  
  public escenarDNI()
  {
    //Leo el QR y el contenido devuelto lo cargo al formulario.
    this.srvLectorQR.openScan().then((stringObtenido)=>
    {
      let contenidoLeido = stringObtenido.split('@');

      this.apellidos_clienteNormal = contenidoLeido[1].charAt(0) + contenidoLeido[1].slice(1).toLocaleLowerCase();
      this.nombre_clienteNormal  = contenidoLeido[2].charAt(0) + contenidoLeido[2].slice(1).toLocaleLowerCase();
      this.dni_clienteNormal  = parseInt(contenidoLeido[4]);

      //Detengo el scanner.
      this.srvLectorQR.stopScan();
    });
  }
  //#endregion -------------------------------------------------------------

  //#region ------------- Funcionamiento de sonido ----------------------
  public switchearEstadoSonido()
  {
    this.sonidoActivado = !this.sonidoActivado;
    let iconoSonido = document.getElementById("icono-sonido-altaCli");

    if (this.sonidoActivado == true)
    {
      iconoSonido.setAttribute("name","volume-mute");
    }
    else
    {
      iconoSonido.setAttribute("name","radio");
    }
  }

  //#endregion -------------------------------------------------------------

  //#region --------- Uploads de archivos (en los inputs) ---------------
  public archivoClienteSubido(event:any, tipoRegistroRecibido:string)
  {
    let fileList = event.target.files;
    console.log(fileList[0]);

    if (tipoRegistroRecibido == "normal")
    {
      if (fileList[0] != undefined)
      {
        //Se setea al atributo del cliente normal
        this.foto_clienteNormal = document.getElementById("file-name-CliNormal").innerHTML = fileList[0]; 
      }
      else
      {
        //Sino, el texto mostrado pasa a ser vacio.
        document.getElementById("file-name-CliNormal").innerHTML = "";
      }
    }
    else if (tipoRegistroRecibido == "anonimo")
    {
      if (fileList[0] != undefined)
      {
        //Se setea al atributo del cliente anonimo
        this.foto_clienteAnonimo = document.getElementById("file-name-CliAnon").innerHTML = fileList[0].name; 
      }
      else
      {
        //Sino, el texto mostrado pasa a ser vacio.
        document.getElementById("file-name-CliAnon").innerHTML = "";
      }
    }
  }

  public registarClienteNormal()
  {
    //Valido datos.
    let datoInvalido = this.srvFirebase.validarClienteNormalDB(
    this.correo_clienteNormal,
    this.password_clienteNormal,
    this.passwordConfirmada_clienteNormal,
    this.nombre_clienteNormal,
    this.apellidos_clienteNormal,
    this.dni_clienteNormal,
    this.foto_clienteNormal);
    
    //Me fijo resultado y actuo en consecuencia
    if (datoInvalido == "ninguno")
    {
      console.log("Datos validos");

      let resultadoRegistro = this.srvAuth.register(this.correo_clienteNormal, this.password_clienteNormal);

      if (resultadoRegistro == "ok")
      {
        this.srvFirebase.subirClienteNormalDB(
        this.correo_clienteNormal,
        this.password_clienteNormal,
        this.nombre_clienteNormal,
        this.apellidos_clienteNormal,
        this.dni_clienteNormal,
        this.foto_clienteNormal); 
      
        this.srvToast.mostrarToast("bottom","La cuenta fue creada satisfactoriamente.",3000,"success");

        this.limpiarDatosClienteNormal();
      }
      else
      {
        switch (resultadoRegistro) 
        {
          case "auth/invalid-email":
          {
            this.srvToast.mostrarToast("bottom","El mail ingresado es inválido.",3000,"danger");;
            break;
          }
          case "auth/internal-error":
          {
            this.srvToast.mostrarToast("bottom","Hubo un error interno de procesamiento.",3000,"danger");
            break;
          }
          case "auth/weak-password":
          {
            this.srvToast.mostrarToast("bottom","La contraseña ingresada es débil. Mínimo 6 caracteres.",3000,"danger");
            break;
          }
          case "auth/missing-email":
          {
            this.srvToast.mostrarToast("bottom","No se ha detectado un mail.",3000,"danger");
            break;
          }
          case "auth/email-already-in-use":
          {
            this.srvToast.mostrarToast("bottom","Ya existe una cuenta con el mail ingresado.",3000,"danger");
            break;
          }
          case "auth/network-request-failed":
          {
            this.srvToast.mostrarToast("bottom","Hubo un problema de conexión. Verifica tu conexión.",3000,"danger");
            break;
          }
          default:
          {
            this.srvToast.mostrarToast("bottom","Ocurrió un error inesperado. Por favor comunícate con el soporte.",3000,"danger");
            break;
          }
        }

        this.srvSonidos.reproducirSonido("error",this.sonidoActivado);
      } 
    }
    else
    {
      console.log("Datos invalidos");
      this.srvToast.mostrarToast("bottom","El/la " + datoInvalido + " es un dato invalido. Verifiquelo por favor.",3000,"danger");
      this.srvSonidos.reproducirSonido("error",this.sonidoActivado);
    } 
    
  }
  //#endregion -------------------------------------------------------------
}
