import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { collection, getFirestore } from '@angular/fire/firestore';

// export const storage = getStorage();
// export const db = getFirestore(app);
// export const clientes = collection(db, "clientes");
// export const anonimos = collection(db, "anonimos");
// export const empleados = collection(db, "empleados");
// export const autoridades = collection(db, "autoridades");
// export const mesas = collection(db, "mesas");

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
      //this.router.navigateByUrl("alta-producto");
    })
  }
}
