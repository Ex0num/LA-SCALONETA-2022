import { Component } from '@angular/core';

import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, doc, Firestore, getDocs, getFirestore, setDoc } from 'firebase/firestore/lite';
import { getStorage } from 'firebase/storage';
import { environment } from 'src/environments/environment';
// import { AuthService } from './Servicios/auth.service';

// Initialize Firebase
export const app = initializeApp(environment.firebaseConfig);
export const storage = getStorage();
export const db = getFirestore(app);
export const clientesNormales = collection(db, "clientes-normales");

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {}
}
