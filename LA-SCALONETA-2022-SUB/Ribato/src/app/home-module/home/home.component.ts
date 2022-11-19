import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Servicios/auth.service';
import { FirebaseService } from 'src/app/Servicios/firebase.service';
import { PushNotificationsService } from 'src/app/Servicios/push-notifications.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit 
{

  constructor(
    public srvAuth:AuthService, 
    public srvFirebase:FirebaseService,
    public router:Router,
    public srvPushNotif:PushNotificationsService) 
    {
      let observableAutoridades = this.srvFirebase.listar_autoridades();
      observableAutoridades.subscribe( (data) => { this.arrayAutoridades = data});

      let observableEmpleados = this.srvFirebase.listar_empleados();
      observableEmpleados.subscribe( (data) => { this.arrayEmpleados = data});

      let observableClientes = this.srvFirebase.listar_clientesNormales();
      observableClientes.subscribe( (data) => { this.arrayClientes = data});

     this.srvAuth.afAuth.user.subscribe( (userData) =>
     {
        if (userData.email != undefined)
        {
          this.srvPushNotif.getUser(); //Hago la superposicion de TOKEN ya que es un usuario con mail. Si es anonimo, no
        }
     });

    //  // ------- Aca envio el push notification -------------
    //     //
    //     // VA PARA EL CELULAR METRE
    //     // 
    //     this.srvPushNotif
    //     .sendPushNotification({
    //       // eslint-disable-next-line @typescript-eslint/naming-convention
    //       registration_ids: [
    //         // eslint-disable-next-line max-len
    //         'fmrRqEWjTYGym_FbSRO-dM:APA91bHh3UOdRYH2OOrP__mmQVAL9oykFH0LVSkHerdfnq4NLdr67aznT13jUo3kh-8d4MjLh_D8FsxeTseyPZJT5mH14NtovUXuahS78ZVjGeQ86Q-QgoVBmj3Tr6ZJpjkri1KP3ccU',
    //       ],
    //       notification: {
    //         title: 'HUBO LOGEO ',
    //         body: 'Hubo un logeo.',
    //       },
    //     })
    //     .subscribe((data) => {
    //       console.log(data);
    //     });

    //     //---------------------------------------------------------
      
    }

  //------------------------ Atributos ---------------------------- //
  public tipoUsuarioLogeado:any;
  public dataUsuarioLogeado:any;

  rangoUsuarioLogeado;
  mailUsuarioLogeado;

  sonidoActivado:boolean = true;
  spinnerMostrandose:boolean = true;

  public arrayClientes:any = [];
  public arrayEmpleados:any = [];
  public arrayAutoridades:any = [];

  //-------------------------------------------------------------- //
  
  ngOnInit() 
  {
    setTimeout(() => 
    {
      this.obtenerSesionActual();
    }, 500);
  }

  deslogearSesion()
  {
    this.srvAuth.logOut(true);
    this.router.navigateByUrl("login");
  }

  traducirTipoAFormaVisual(tipoUsuarioCrudo:string)
  {
    let resultado;

    switch (tipoUsuarioCrudo) 
    {
      case 'cliente':
      {
        resultado = "Cliente";
        break;
      }
      case 'anonimo':
      {
        resultado = "Anónimo";
        break;
      }
      case 'dueno':
      {
        resultado = "Dueño";
        break;
      }
      case 'supervisor':
      {
        resultado = "Supervisor";
        break;
      }
      case 'bartender':
      {
        resultado = "Bartender";
        break;
      }
      case 'metre':
      {
        resultado = "Metre";
        break;
      }
      case 'cocinero':
      {
        resultado = "Cocinero";
        break;
      }
      case 'mozo':
      {
        resultado = "Mozo";
        break;
      }
    }

    return resultado;
  }

  //------------- Funcionamiento de sonido --------------------------
  switchearEstadoSonido()
  {
    this.sonidoActivado = !this.sonidoActivado;
    let iconoSonido = document.getElementById("icono-sonido-home");

    if (this.sonidoActivado == true)
    {
      iconoSonido.setAttribute("name","volume-mute");
    }
    else
    {
      iconoSonido.setAttribute("name","radio");
    }
  }

  //----------------- Metodo de obtencion de sesion -----------------
  obtenerSesionActual()
  {
    setTimeout(() => 
    {
      this.srvAuth.afAuth.user.subscribe( (user)=>
      {
        if (user != undefined && user != null)
        {
          this.dataUsuarioLogeado = this.buscar_UsuarioPorMail(user.email);

          this.tipoUsuarioLogeado = this.dataUsuarioLogeado.tipo;
          
          this.mailUsuarioLogeado = this.dataUsuarioLogeado.correo;
          let tipoAMostrar = this.traducirTipoAFormaVisual(this.tipoUsuarioLogeado);
          this.rangoUsuarioLogeado = tipoAMostrar;
    
          this.spinnerMostrandose = false;
        }
        else
        {
          this.tipoUsuarioLogeado = 'anonimo';

          //El mail del "logeado" va a ser el nombre del anonimo
          this.mailUsuarioLogeado = this.srvAuth.nombreDelAnonimo;
          console.log(this.srvAuth.nombreDelAnonimo);

          let tipoAMostrar = this.traducirTipoAFormaVisual(this.tipoUsuarioLogeado);
          this.rangoUsuarioLogeado = tipoAMostrar;
    
          this.spinnerMostrandose = false;
        }
        
        console.log(this.dataUsuarioLogeado);
      });

    }, 2500);
  }

  // -- G E N E R A L E S ---
  public buscar_UsuarioPorMail(mailRecibido:string)
  {
    let usuarioEncontrado:any;

    //Como esto no esto no es tan optimo, no voy a seguir leyendo mas tablas 
    //si ya encontre un usuario...

    if (usuarioEncontrado == undefined)
    {
      (this.arrayClientes).forEach((cliente) => 
      {
        if (cliente["correo"] != undefined && cliente["correo"].toLowerCase()  == mailRecibido.toLowerCase())
        {
          usuarioEncontrado = cliente;
        }
      });
    }

    if (usuarioEncontrado == undefined)
    {
      (this.arrayEmpleados).forEach((empleado) => 
      {
        if (empleado["correo"] != undefined && empleado["correo"].toLowerCase()  == mailRecibido.toLowerCase())
        {
          usuarioEncontrado = empleado;
        }
      });
    }

    if (usuarioEncontrado == undefined)
    {
      (this.arrayAutoridades).forEach((autoridad) => 
      {
        if (autoridad["correo"] != undefined && autoridad["correo"].toLowerCase()  == mailRecibido.toLowerCase())
        {
          usuarioEncontrado = autoridad;
        }
      });
    }
  
    console.log(usuarioEncontrado);
    return usuarioEncontrado;
  }

}

