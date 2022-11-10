import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, doc, Firestore, getDocs, getFirestore, setDoc } from 'firebase/firestore/lite';
import { getStorage } from 'firebase/storage';
import { environment } from 'src/environments/environment';
import { SplashScreen } from '@capacitor/splash-screen';
// import { AuthService } from './Servicios/auth.service';

// Initialize Firebase
export const app = initializeApp(environment.firebaseConfig);
export const storage = getStorage();
export const db = getFirestore(app);
export const clientes = collection(db, "clientes");
export const anonimos = collection(db, "anonimos");
export const empleados = collection(db, "empleados");
export const autoridades = collection(db, "autoridades");
export const mesas = collection(db, "mesas");

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  
  constructor(private platform: Platform, private router: Router) 
  {
    this.initializeApp();
  }

  public initializeApp()
  {
    this.platform.ready().then(()=>
    {
      SplashScreen.hide();
      //this.router.navigateByUrl("splash");
      this.router.navigateByUrl("login");
    })
  }
}
