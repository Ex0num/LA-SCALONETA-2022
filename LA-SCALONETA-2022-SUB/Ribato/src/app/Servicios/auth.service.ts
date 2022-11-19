import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastMsgService } from './toast-msg.service';
import { SonidosPersonalizadosService } from './sonidos-personalizados.service';
import { FirebaseService } from './firebase.service';
// import { getAuth, onAuthStateChanged } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService 
{
  encuestaEnviada = false;

  userLogedData:any;

  constructor(
    public afAuth: AngularFireAuth, 
    private router : Router,
    public srvToast:ToastMsgService,
    public srvSonidos:SonidosPersonalizadosService,
    public srvFirebase:FirebaseService) 
    {
      this.srvFirebase.listar_usuarios().subscribe( (data) => 
      {
        this.arrayUsuarios = data;
      });
    }

    // public dataConsumidor;

    public pedidoEnviado = false;
    
    public nombreDelAnonimo;
    public tipoUserloged;

    private arrayUsuarios:any = [];
    public dataUsuarioLogeado:any;

  async login(email: string, password:string, sonidoActivadoRecibido:boolean)
  {
    try 
    {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);      
      this.userLogedData = userCredential.user;

      this.arrayUsuarios.forEach(usuario => 
      {
        if (usuario.correo == email)
        {
          this.dataUsuarioLogeado = usuario;
          console.log(this.dataUsuarioLogeado);
        }
      });

      return this.userLogedData;
    } 
    catch (error) 
    {      
      console.log(error.code);

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

    }
  }

  async register(email: string, password: string, sonidoActivadoRecibido:boolean)
  {
    try 
    {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      // this.sendVerificationEmail();
      return userCredential;
    } 
    catch (error) 
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

    }
  }

  async logOut(goToLogin:boolean)
  {
    try 
    {
      await this.afAuth.signOut().then(()=>
      {
        if (goToLogin == true)
        {
          this.router.navigateByUrl('/login');
        }
      });
    } 
    catch (error) 
    {
      console.log(error);
    }
  }

  async sendVerificationEmail():Promise<void>
  {
    return (await this.afAuth.currentUser)?.sendEmailVerification();
  }
}
