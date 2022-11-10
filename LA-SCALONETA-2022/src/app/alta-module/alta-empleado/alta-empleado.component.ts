import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Servicios/auth.service';
import { FirebaseService } from 'src/app/Servicios/firebase.service';
import { ScannerQRService } from 'src/app/Servicios/scanner-qr.service';
import { SonidosPersonalizadosService } from 'src/app/Servicios/sonidos-personalizados.service';
import { ToastMsgService } from 'src/app/Servicios/toast-msg.service';

@Component({
  selector: 'app-alta-empleado',
  templateUrl: './alta-empleado.component.html',
  styleUrls: ['./alta-empleado.component.scss'],
})
export class AltaEmpleadoComponent implements OnInit {

  constructor(
    public srvLectorQR:ScannerQRService,
    public srvToast:ToastMsgService, 
    public srvSonidos:SonidosPersonalizadosService,
    public srvFirebase:FirebaseService,
    public srvAuth:AuthService,
    public router:Router
  ) { }

  ngOnInit() {}

    //#region ------------------------ Atributos ----------------------------
    public sonidoActivado:boolean = true;

    //Datos empleado
    public correo_empleado:string;
    public password_empleado:string;
    public passwordConfirmada_empleado:string;
    public nombre_empleado:string;
    public apellidos_empleado:string;
    public dni_empleado:number;
    public cuil_empleado:string;
    public foto_empleado:string;

    //Por defecto viene la primer opcion del select. (Metre). En el caso de cambiar, cambia lo más bien :)
    public tipo_empleado:string = "metre";

    //#endregion -------------------------------------------------------------


    //------------------ Funciones generales ---------------------
    public async registarEmpleado()
    {
      if (this.correo_empleado != undefined && this.correo_empleado != "")
      {
        //Valido datos.
        let datoInvalido = this.srvFirebase.validarEmpleadoDB(
        this.correo_empleado,
        this.password_empleado,
        this.passwordConfirmada_empleado,
        this.nombre_empleado,
        this.apellidos_empleado,
        this.dni_empleado,
        this.tipo_empleado,
        this.cuil_empleado,
        this.foto_empleado);
        //let datoInvalido = "ninguno"

        //Me fijo resultado y actuo en consecuencia
        if (datoInvalido == "ninguno")
        {
          console.log("Datos validos");
    
          let resultadoRegistro = await this.srvAuth.registerSinLogearse(this.correo_empleado, this.password_empleado, this.sonidoActivado);
          //let resultadoRegistro = "ok";
    
          if (resultadoRegistro == "ok")
          {
            this.srvFirebase.subirEmpleadoDB(
            this.correo_empleado,
            this.password_empleado,
            this.nombre_empleado,
            this.apellidos_empleado,
            this.dni_empleado,
            this.tipo_empleado,
            this.cuil_empleado,
            this.foto_empleado); 
          
            //Acciones finales
            this.srvToast.mostrarToast("bottom","La cuenta fue creada satisfactoriamente.",3000,"success");
            this.srvSonidos.reproducirSonido("slide",this.sonidoActivado);  
            this.limpiarDatosEmpleado();
            
            setTimeout(() => 
            {
              this.router.navigateByUrl("home");
            }, 800);
          
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

          console.log(resultadoRegistro);
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

    private limpiarDatosEmpleado()
    {
      this.correo_empleado = "";
      this.password_empleado = "";
      this.passwordConfirmada_empleado = "";
      this.nombre_empleado = "";
      this.apellidos_empleado = "";
      this.dni_empleado = undefined;
      
      //Se "limpia" el archivo subido tmb.
      document.getElementById("file-name-empleado").innerHTML = "";
    }

    public escenarDNI()
    {
      //Leo el QR y el contenido devuelto lo cargo al formulario.
      this.srvLectorQR.openScan().then((stringObtenido)=>
      {
        let contenidoLeido = stringObtenido.split('@');
  
        this.apellidos_empleado = contenidoLeido[1].charAt(0) + contenidoLeido[1].slice(1).toLocaleLowerCase();
        this.nombre_empleado  = contenidoLeido[2].charAt(0) + contenidoLeido[2].slice(1).toLocaleLowerCase();
        this.dni_empleado  = parseInt(contenidoLeido[4]);
  
        //Detengo el scanner.
        this.srvLectorQR.stopScan();
      });
    }

    actualizarTipoEmpleado(event:any)
    {
      this.tipo_empleado = event.target.value;

      switch (this.tipo_empleado) 
      {
        case 'Mozo':
        {
          this.tipo_empleado = "mozo";
          break;
        }
        case 'Cocinero':
        {
          this.tipo_empleado = "cocinero";
          break;
        }
        case 'Bartender':
        {
          this.tipo_empleado = "bartender";
          break;
        }
        case 'Metre':
        {
          this.tipo_empleado = "metre";
          break;
        }
      }

      console.log(this.tipo_empleado);
    }

    // ------------- Funcionamiento de sonido ----------------------//
    public switchearEstadoSonido()
    {
      this.sonidoActivado = !this.sonidoActivado;
      let iconoSonido = document.getElementById("icono-sonido-altaEmpleado");
      
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
    public archivoEmpleadoSubido(event:any)
    {
      let fileList = event.target.files;
      console.log(fileList[0]);


        if (fileList[0] != undefined)
        {
          //Se setea al atributo de la autoridad
          this.foto_empleado = fileList[0]; 
          document.getElementById("file-name-empleado").innerHTML =  fileList[0].name; 
        }
        else
        {
          //Sino, el texto mostrado pasa a ser vacio.
          document.getElementById("file-name-empleado").innerHTML = "";
        }
    }
    //-------------------------------------------------------------

    registarempleado()
    {
      console.log("Registrar");
    }
}
