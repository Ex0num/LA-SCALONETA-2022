import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Servicios/auth.service';
import { FirebaseService } from 'src/app/Servicios/firebase.service';
import { ScannerQrService } from 'src/app/Servicios/scanner-qr.service';
import { SonidosPersonalizadosService } from 'src/app/Servicios/sonidos-personalizados.service';
import { ToastMsgService } from 'src/app/Servicios/toast-msg.service';

@Component({
  selector: 'app-alta-empleado',
  templateUrl: './alta-empleado.component.html',
  styleUrls: ['./alta-empleado.component.scss'],
})
export class AltaEmpleadoComponent implements OnInit {

  constructor(
    public srvLectorQR:ScannerQrService,
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
    public dni_empleado:string;
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
        let datoInvalido = this.srvFirebase.validar_empleado(
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
    
          let resultadoRegistro = await this.srvAuth.register(this.correo_empleado, this.password_empleado, this.sonidoActivado);
          //let resultadoRegistro = "ok";
    
          if (resultadoRegistro != undefined)
          {
            this.srvFirebase.alta_empleado(
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

      if (contenidoLeido.length >= 16) //Si tiene mas de 16 arrobas
      {
        //Es dni QR VIEJO
        this.apellidos_empleado = contenidoLeido[4] //Apellidos;
        this.nombre_empleado = contenidoLeido[5] //Nombre;
        this.dni_empleado = contenidoLeido[1].trim(); //DNI;
      }
      else
      {
        //Es dni QR NUEVO
        this.apellidos_empleado = contenidoLeido[1]; //Apellido
        this.nombre_empleado  = contenidoLeido[2] //Nombre
        this.dni_empleado  = contenidoLeido[4]; //DNI

        let cuilSliced = contenidoLeido[8].split(""); //CUIL
        let cuilFinal = cuilSliced[0] + cuilSliced[1] + "-" + this.dni_empleado + "-" + cuilSliced[2];
        this.cuil_empleado = cuilFinal;
      }
  
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
}
