import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss'],
})
export class SplashComponent implements OnInit {

  constructor(public router:Router) { }

  ngOnInit() 
  {
    let imagenSplash = document.getElementById("icono-principal-splash");
    imagenSplash.style.animation = "slide-in-elliptic-top-fwd 0.7s cubic-bezier(0.250, 0.460, 0.450, 0.940) both";
  
    let tituloPrincipal = document.getElementById("container-titulo-principal-splash");
    tituloPrincipal.style.animation = "heartbeat 1.5s ease-in-out infinite both";

    let nombreAlpha = document.getElementById("nombre-alpha");
    let nombreBeta = document.getElementById("nombre-beta");
    let nombreGamma = document.getElementById("nombre-gamma");
    let nombreMateria = document.getElementById("nombre-materia");
    nombreAlpha.style.animation = "tracking-in-expand 1.2s cubic-bezier(0.215, 0.610, 0.355, 1.000) both";
    nombreBeta.style.animation = "tracking-in-expand 1.2s cubic-bezier(0.215, 0.610, 0.355, 1.000) both";
    nombreGamma.style.animation = "tracking-in-expand 1.2s cubic-bezier(0.215, 0.610, 0.355, 1.000) both";
    nombreMateria.style.animation = "tracking-in-expand 1.2s cubic-bezier(0.215, 0.610, 0.355, 1.000) both";

    setTimeout(() => {
      imagenSplash.style.animation = "wobble-hor-bottom 1s infinite";
    }, 1000);

    setTimeout(() => {
      this.router.navigateByUrl('login');
    }, 3500);
  }
}
