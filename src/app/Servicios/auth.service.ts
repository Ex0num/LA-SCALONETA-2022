import { Injectable } from '@angular/core';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, sendEmailVerification} from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  public register(mailRecibido:string, passwordRecibida:string)
  {
    let resultadoRegistro = "ok";

    const auth = getAuth();
    
    createUserWithEmailAndPassword(auth, mailRecibido, passwordRecibida).then(async (userCredential) => 
    {
      console.log("El registro de usuario fue satisfactorio. Bienvenido/a.");
      resultadoRegistro = "ok";
    })
    .catch((error) => 
    {
      resultadoRegistro = error.code;
    });

    return resultadoRegistro;
  }
}
