import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, sendEmailVerification} from 'firebase/auth';
import { FirebaseService } from './firebase.service';
import { SonidosPersonalizadosService } from './sonidos-personalizados.service';
import { ToastMsgService } from './toast-msg.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( 
    public srvFirebase:FirebaseService,
    public router:Router,
    public srvToast:ToastMsgService, 
    public srvSonidos:SonidosPersonalizadosService,) 
    {}

  //#region ------------------------ Atributos ----------------------------
    public userLogedMail;
    public tipoUsuarioLogeado;
    public estaAprobadoEnElSistema;
    //#endregion -------------------------------------------------------------
  
  public async login(mailRecibido:string, passwordRecibida:string, sonidoActivadoRecibido:boolean)
  {
    let loginSalioBien = false;

    const auth = getAuth();
    
    await signInWithEmailAndPassword(auth, mailRecibido, passwordRecibida).then(async (userCredential) =>
    {
      console.log("-------------------------------------------------");
      console.log("El inicio de sesión fue satisfactorio. Bienvenido/a.");
      console.log("-------------------------------------------------");

      // Signed in
      const userLoged = userCredential.user;

      // this.isLoged = true;
      this.userLogedMail = userLoged.email;

      loginSalioBien = true;

    }).catch((error) => 
    {
      console.log(error.code);
      this.srvToast.mostrarToast("bottom","Algo salió mal. Lo sentimos, de verdad.",3000,"danger");
      
      switch (error.code) 
      {
        case "auth/user-not-found":
        {
          this.srvToast.mostrarToast("bottom","No se encontró ningún usuario con ese correo.",3000,"danger");;
          break;
        }
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

      this.srvSonidos.reproducirSonido("error",sonidoActivadoRecibido);
    });

    return loginSalioBien;
  }

  public register(mailRecibido:string, passwordRecibida:string)
  {
    let resultadoRegistro = "ok";

    const auth = getAuth();
    
    createUserWithEmailAndPassword(auth, mailRecibido, passwordRecibida).then(async (userCredential) => 
    {
      console.log("-------------------------------------------------");
      console.log("El registro de usuario fue satisfactorio. Bienvenido/a.");
      console.log("-------------------------------------------------");
      resultadoRegistro = "ok";
    })
    .catch((error) => 
    {
      resultadoRegistro = error.code;
    });

    return resultadoRegistro;
  }

  public logOut()
  {
    const auth = getAuth();
    signOut(auth).then(() => 
    {
      // Sign-out successful.
      console.log("-------------------------------------------------");
      console.log("Cierre de sesión satisfactorio. Vuelva prontosss!");
      console.log("-------------------------------------------------");

    }).catch((error) => 
    {
      // An error happened.
      console.log(error);
    });
  }

  public async sesionActual()
  {
    const auth = await getAuth();

    let mailLogeado:string;

    await onAuthStateChanged(auth, async (user) => 
    {
      if (user) 
      {
        //Si el usuario esta logeado
        mailLogeado = user.email;
        console.log(mailLogeado);
      } 
      else 
      {
        //Si el usuario no esta logeado
        mailLogeado = undefined;
      }
    });
  
    return mailLogeado;
  }

  public async obtenerDatosMailRecibido(mailRecibido)
  {
    // Leo en mi DB entera y busco a quien le pertenece el mail. Obtengo su info total
    let userData = await this.srvFirebase.buscarUsuarioPorMail(mailRecibido);

    console.log(userData);

    if (userData.tipo == undefined)
    {
      userData.tipo = "cliente";
    }
    else
    {
      userData.tipo = userData.tipo;
    }

    this.tipoUsuarioLogeado = userData.tipo;
    this.estaAprobadoEnElSistema = userData.estado;

    // Si es usuario me guardo su estado
    if (this.tipoUsuarioLogeado == "cliente")
    {
      console.log("-------------------------------------------------");
      console.log("USERLOGED-MAIL:" + userData.correo);
      console.log("TIPO:" + this.tipoUsuarioLogeado);
      console.log("ESTA-APROBADO:" + this.estaAprobadoEnElSistema);
      console.log("-------------------------------------------------");
    }
    else
    {
      console.log("-------------------------------------------------");
      console.log("USERLOGED-MAIL:" + this.userLogedMail);
      console.log("TIPO:" + this.tipoUsuarioLogeado);
      console.log("-------------------------------------------------");
    }

    return userData;
  }
}
