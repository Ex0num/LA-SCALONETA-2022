import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Servicios/auth.service';
import { FirebaseService } from 'src/app/Servicios/firebase.service';
import { ScannerQrService } from 'src/app/Servicios/scanner-qr.service';
import { SonidosPersonalizadosService } from 'src/app/Servicios/sonidos-personalizados.service';
import { ToastMsgService } from 'src/app/Servicios/toast-msg.service';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-mesa-home',
  templateUrl: './mesa-home.component.html',
  styleUrls: ['./mesa-home.component.scss'],
})
export class MesaHomeComponent implements OnInit {

  constructor(
    public srvLectorQR:ScannerQrService,
    public srvToast:ToastMsgService, 
    public srvSonidos:SonidosPersonalizadosService,
    public srvFirebase:FirebaseService,
    public srvAuth:AuthService,
    public router:Router
  ) 
  {
    //Me traigo los consumidores y me suscribo a la db cosa de actualizarlo en tiempo real al consumidor actual
    this.srvFirebase.listar_consumidores().subscribe((data)=>
    {
      this.arrayConsumidores = data;
      console.log(this.arrayConsumidores); 
      
      //Los recorro. 
      data.forEach( (element) => 
      {
        //Si el consumidor actual ya fue cargado voy a reemplazar sus datos xq la actualizacion de la db podria pertenecerle
        if (this.consumidorActual != undefined && this.consumidorActual.nombre == element.nombre && element.estado != 'retirado')
        { 
          console.log("Actualizando data del consumidor actual...");
          this.consumidorActual = element;

          //Si la actualizacion es que ya fue asignado a una mesa y paso de "esperando_mesa" a "escaneando_mesa", lo llevamos al siguiente nivel
          if (this.consumidorActual.estado == 'escaneando_mesa') {this.router.navigateByUrl("mesa-home")}
        }
      })
    });

    //Encuestas
    this.srvFirebase.listar_encuestas().subscribe((data) => 
    {
      this.arrayEncuestasGraphs = data;
      console.log(this.arrayEncuestasGraphs);
    });

    setTimeout(() => 
    {
      //Me fijo quien esta logeado
      this.detectarUsuarioActual();
    }, 2500);
  }

  ngOnInit() 
  {
    //------Encuestas graphs------- 
    setTimeout(() => 
    {
      this.cargarDataGraphs();
      console.log(this.arrayEncuestasGraphs);
    }, 2000);
    //-----------------------------
  }

  //#region ------------------------ Atributos ----------------------------
  public sonidoActivado:boolean = true;

  arrayConsumidores:any = [];
  consumidorActual:any;

  cargaDeConsumidorTerminada = false;
  mesaEscaneadaSatisfactoriamente = false;

   //#region ------------ Encuestas GRAPHS -------------------
    
   public chart1:any;
   public dataChart1:any[] = [];

   public chart2:any;
   public dataChart2:any[] = [];

   public chart3:any;
   public dataChart3:any[] = [];

   arrayEncuestasGraphs:any = [];
   mostrarResultadosEncuestas = false;

   //--------------------------------------------------------------------------------------------------
   
   switchearMostrarResultadosEncuestasHomeMesa()
   {
     let graficosEncuestas = document.getElementById("graphs-resultados-encuestas-homeMesa");

     if (this.mostrarResultadosEncuestasHomeMesa == false)
     {
       this.mostrarResultadosEncuestasHomeMesa = true;
       graficosEncuestas.removeAttribute("hidden");

       //Asigno animacion de entrada a los graphs  
       // graficosEncuestas.style.animation = "slide-in-elliptic-bottom-fwd 0.7s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;";
     }
     else
     {
       this.mostrarResultadosEncuestasHomeMesa = false;
       graficosEncuestas.setAttribute("hidden","true");

       //Asigno animacion de salida a los graphs
       // graficosEncuestas.style.animation = "slide-out-bottom 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;";
     }
   }

   public cargarDataGraphs()
   {
     //Cargo la data de todos los charts que tenga
     console.log("CARGANDO DATA GRAPHS");

     //----------- Inicializacion de 0 y carga de datos. --------------
     this.dataChart1[0] = 0;
     this.dataChart1[1] = 0;

     this.dataChart2[0] = 0;
     this.dataChart2[1] = 0;

     this.dataChart3[0] = 0;
     this.dataChart3[1] = 0;

     this.arrayEncuestasGraphs.forEach(encuesta => 
       { 
           if (encuesta.comidaRica == 'Si')
           {
             this.dataChart1[0]++;
           }
           else if (encuesta.comidaRica == 'No')
           {
             this.dataChart1[1]++;
           }

           if (encuesta.atencionEmpleados == 'Si')
           {
             this.dataChart2[0]++;
           }
           else if (encuesta.atencionEmpleados == 'No')
           {
             this.dataChart2[1]++;
           }

           if (encuesta.preciosAcordes == 'Si')
           {
             this.dataChart3[0]++;
           }
           else if (encuesta.preciosAcordes == 'No')
           {
             this.dataChart3[1]++;
           }
     });
      //---------------------------------------------------------------

     //Renderizacion y carga de los graficos ya con sus datos generados
     this.cargarPieChart();
     this.cargarBarChart();
     this.cargarDognutChart();
   }

   public cargarPieChart()
   {
     const ctx4:any = 'pieChart-homeMesa';

     this.chart1 = new Chart(ctx4, 
       {
       type: 'pie',
       data: {
           labels: ['Si', 'No'],
           datasets: [{
               label: '??Le gust?? la comida?.',
               data: this.dataChart1,
               backgroundColor: [
                 'green',
                 'red',
             ],
             borderColor: 'gray'
           }]
       },
       options: {scales: {y: {beginAtZero: true}},responsive: true, maintainAspectRatio: false}
     });
   }

   public cargarBarChart()
   {
     const ctx5:any = 'barChart-homeMesa';

     this.chart2 = new Chart(ctx5, 
       {
       type: 'bar',
       data: {
           labels: ['Si', 'No'],
           datasets: [{
               label: '??La atenci??n de empleados fue buena?.',
               data: this.dataChart2,
               backgroundColor: [
                 'green',
                 'red',
             ],
             borderColor: 'gray'
           }]
       },
       options: {scales: {y: {beginAtZero: true}},responsive: true, maintainAspectRatio: false}
     });
   }

   public cargarDognutChart()
   {
     const ctx6:any = 'dognutChart-homeMesa';

     this.chart3 = new Chart(ctx6, 
       {
       type: 'doughnut',
       data: {
           labels: ['Si', 'No'],
           datasets: [{
               label: '??Los precios fueron acordes?.',
               data: this.dataChart3,
               backgroundColor: [
                 'green',
                 'red',
             ],
             borderColor: 'gray'
           }]
       },
       options: {scales: {y: {beginAtZero: true}},responsive: true, maintainAspectRatio: false}
     });
   }
 
 //#endregion ----------------------------------------


  // ------------- Funcionamiento de sonido ----------------------//
  public switchearEstadoSonido()
  {
    this.sonidoActivado = !this.sonidoActivado;
    let iconoSonido = document.getElementById("icono-sonido-altaAutoridad");
    
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
 
  detectarUsuarioActual()
  {

    //Si la sesion es anonima el alta del consumidor se hace con el nombre del anonimo
    if (this.srvAuth.nombreDelAnonimo != undefined)
    {
      console.log("El usuario actual es ANONIMO");
      console.log(this.srvAuth.nombreDelAnonimo);

      this.arrayConsumidores.forEach(consumidor =>
      {
          if (consumidor.nombre == this.srvAuth.nombreDelAnonimo)
          {
            console.log("Consumidor actual cargado!");
            this.consumidorActual = consumidor;
            this.cargaDeConsumidorTerminada = true;
          }
      });

    }
    else
    {
      //Si no, el alta del consumidor se hace con el mail del logeado
      let mailLogeado; 

      this.srvAuth.afAuth.user.subscribe((data) => 
      {
        mailLogeado = data.email;

        console.log("El usuario actual es REGISTRADO");
        console.log(mailLogeado);

        this.arrayConsumidores.forEach(consumidor =>
        {
            if (consumidor.nombre == mailLogeado)
            {
              console.log("Consumidor actual cargado!");
              this.consumidorActual = consumidor;
              this.cargaDeConsumidorTerminada = true;
            }
        });

      });
     
    }

    this.cargaDeConsumidorTerminada = true;

  }
  
  public escenarQR_Mesa()
  {
    //Leo el QR y el contenido devuelto lo cargo al formulario.
    this.srvLectorQR.openScan().then((stringObtenido)=>
    {
      let contenidoLeido = stringObtenido;

      //Detengo el scanner.
      this.srvLectorQR.stopScan();

      if (contenidoLeido == this.consumidorActual.mesaAsignada)
      {
        this.srvToast.mostrarToast("bottom","El QR pertenece a su mesa. ??Genial!...",2500,"success");
        this.srvSonidos.reproducirSonido("bubble", this.sonidoActivado);
        
        this.mesaEscaneadaSatisfactoriamente = true;

        //Nuevo estado del consumidor actual
        this.consumidorActual.estado = 'realizando_pedido';
        this.srvFirebase.modificar_consumidor(this.consumidorActual, this.consumidorActual.id);
      }
      else
      {
        this.srvToast.mostrarToast("bottom","El QR analizado no corresponde a su mesa asignada.",2500,"danger");
        this.srvSonidos.reproducirSonido("error", this.sonidoActivado);
      }
    });
  }

  public testing()
  {
    //Leo el QR y el contenido devuelto lo cargo al formulario.
    //this.srvLectorQR.openScan().then((stringObtenido)=>
    //{
      //let contenidoLeido = stringObtenido;
      let contenidoLeido = this.consumidorActual.mesaAsignada;
      //Detengo el scanner.
      //this.srvLectorQR.stopScan();

      if (contenidoLeido == this.consumidorActual.mesaAsignada)
      {
        this.srvToast.mostrarToast("bottom","El QR pertenece a su mesa. ??Genial!...",2500,"success");
        this.srvSonidos.reproducirSonido("bubble", this.sonidoActivado);
        
        this.mesaEscaneadaSatisfactoriamente = true;

        //Nuevo estado del consumidor actual
        this.consumidorActual.estado = 'realizando_pedido';
        this.srvFirebase.modificar_consumidor(this.consumidorActual, this.consumidorActual.id);
      }
      else
      {
        this.srvToast.mostrarToast("bottom","El QR analizado no corresponde a su mesa asignada.",2500,"danger");
        this.srvSonidos.reproducirSonido("error", this.sonidoActivado);
      }
    //});
  }

  // ENCUESTAS

  mostrarResultadosEncuestasHomeMesa = false;

  switchearMostrarResultadosEncuestas()
  {
    let graficosEncuestas = document.getElementById("graphs-resultados-encuestas");
    
    if (this.mostrarResultadosEncuestas == false)
    {
      this.mostrarResultadosEncuestas = true;

      //Asigno animacion de entrada a los graphs  
      graficosEncuestas.style.animation = "slide-in-elliptic-bottom-fwd 0.7s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;";
    }
    else
    {
      this.mostrarResultadosEncuestas = false;

      //Asigno animacion de salida a los graphs
      graficosEncuestas.style.animation = "slide-out-bottom 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;";
    }
  }

  menu()
  {
    this.router.navigateByUrl("menu-productos");
  }

  consultarMozo()
  {
    this.router.navigateByUrl("chat-mozos");
  }

  realizarPedido()
  {
    this.router.navigateByUrl("realizar-pedido");
  }
}
