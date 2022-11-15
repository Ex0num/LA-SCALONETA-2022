import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { element } from 'protractor';
import { AuthService } from 'src/app/Servicios/auth.service';
import { FirebaseService } from 'src/app/Servicios/firebase.service';
import { ScannerQrService } from 'src/app/Servicios/scanner-qr.service';
import { SonidosPersonalizadosService } from 'src/app/Servicios/sonidos-personalizados.service';
import { ToastMsgService } from 'src/app/Servicios/toast-msg.service';
import { HomeComponent } from '../home.component';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-home-cliente',
  templateUrl: './home-cliente.component.html',
  styleUrls: ['./home-cliente.component.scss'],
})
export class HomeClienteComponent implements OnInit {

  constructor(
    public srvLectorQR:ScannerQrService,
    public srvToast:ToastMsgService, 
    public srvSonidos:SonidosPersonalizadosService,
    public srvFirebase:FirebaseService,
    public srvAuth:AuthService,
    public router:Router
  ) 
  {
    //Me traigo los consumidores
    this.srvFirebase.listar_consumidores().subscribe((data)=>
    {
      this.arrayConsumidores = data;
      console.log(this.arrayConsumidores); 
      
      //Los recorro. 
      data.forEach( (element) => 
      {
        //Si el consumidor actual ya fue cargado voy a reemplazar sus datos xq la actualizacion de la db podria pertenecerle
        if (this.consumidorActual != undefined && this.consumidorActual.nombre == element.nombre)
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

  //#region ------------------------ Atributos ---------------------------------
  clienteEnListaDeEspera = false;
  consumidorFueCargado = false;

  arrayConsumidores:any = [];
  consumidorActual:any;
  //#endregion -------------------------------------------------------------------

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
    
    switchearMostrarResultadosEncuestas()
    {
      let graficosEncuestas = document.getElementById("graphs-resultados-encuestas-homeCliente");
      let loader = document.getElementById("loader-home-cliente");

      if (this.mostrarResultadosEncuestas == false)
      {
        this.mostrarResultadosEncuestas = true;
        graficosEncuestas.removeAttribute("hidden");

        loader.setAttribute("hidden","true");
        //Asigno animacion de entrada a los graphs  
        // graficosEncuestas.style.animation = "slide-in-elliptic-bottom-fwd 0.7s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;";
      }
      else
      {
        this.mostrarResultadosEncuestas = false;
        graficosEncuestas.setAttribute("hidden","true");

        loader.removeAttribute("hidden");
        //Asigno animacion de salida a los graphs
        // graficosEncuestas.style.animation = "slide-out-bottom 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;";
      }
    }

    public async cargarDataGraphs()
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
      const ctx1:any = 'pieChart-homeCliente';

      this.chart1 = new Chart(ctx1, 
        {
        type: 'pie',
        data: {
            labels: ['Si', 'No'],
            datasets: [{
                label: '¿Le gustó la comida?.',
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
      const ctx2:any = 'barChart-homeCliente';

      this.chart2 = new Chart(ctx2, 
        {
        type: 'bar',
        data: {
            labels: ['Si', 'No'],
            datasets: [{
                label: '¿La atención de empleados fue buena?.',
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
      const ctx3:any = 'dognutChart-homeCliente';

      this.chart3 = new Chart(ctx3, 
        {
        type: 'doughnut',
        data: {
            labels: ['Si', 'No'],
            datasets: [{
                label: '¿Los precios fueron acordes?.',
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

  //------------------ Funciones generales ---------------------

  public escenarQR_Ingreso()
  {
    //Leo el QR y el contenido devuelto lo cargo al formulario.
    this.srvLectorQR.openScan().then((stringObtenido)=>
    {
      let contenidoLeido = stringObtenido;

      //Detengo el scanner.
      this.srvLectorQR.stopScan();

      if (contenidoLeido == "ingreso_local")
      {
        this.srvToast.mostrarToast("bottom","El ingreso al local fue satisfactorio. Espere a ser asignado una mesa.",2500,"success");
        this.srvSonidos.reproducirSonido("bubble", HomeComponent.prototype.sonidoActivado);

        //Aca envio el push notification al METRE. Hay un nuevo cliente en la lista de espera
        // TO DO
        //----------------------------
        
        //Si la sesion es anonima el alta del consumidor se hace con el nombre del anonimo
        if (this.srvAuth.nombreDelAnonimo != undefined)
        {
          console.log("Dando de alta consumidor ANONIMO");
          console.log(this.srvAuth.nombreDelAnonimo);

          this.srvFirebase.alta_consumidor(this.srvAuth.nombreDelAnonimo);   

          setTimeout(() => 
          {
            this.arrayConsumidores.forEach(element => 
              {
                if (element.nombre == this.srvAuth.nombreDelAnonimo)
                {
                  console.log("Encontrado el consumidor dado de alta! (QUE ERA ANONIMO)");
                  console.log(this.consumidorActual);
                  this.consumidorActual = element;
                  this.consumidorFueCargado = true;
                  this.clienteEnListaDeEspera = true;
                }
              });

          }, 2000);

        }
        else
        {
          //Si no, el alta del consumidor se hace con el mail del logeado
          let mailLogeado; 

          this.srvAuth.afAuth.user.subscribe((data) => 
          {
            mailLogeado = data.email;

            console.log("Dando de alta consumidor LOGEADO");
            console.log(mailLogeado);
            this.srvFirebase.alta_consumidor(mailLogeado); 

            setTimeout(() => 
            {
              this.arrayConsumidores.forEach(element => 
                {
                  if (element.nombre == mailLogeado)
                  {
                    console.log("Encontrado el consumidor dado de alta! (QUE ERA CLIENTE REGISTRADO)");
                    console.log(this.consumidorActual);
                    this.consumidorActual = element;
                    this.consumidorFueCargado = true;
                    this.clienteEnListaDeEspera = true;
                  }
                });
      
            }, 2000);

          });
        
        }

      }
      else
      {
        this.srvToast.mostrarToast("bottom","El QR analizado no corresponde al ingreso al local.",2500,"danger");
        this.srvSonidos.reproducirSonido("error", HomeComponent.prototype.sonidoActivado);
      }
    });
  }

  testing()
  {
    this.srvToast.mostrarToast("bottom","El ingreso al local fue satisfactorio. Espere a ser asignado una mesa.",2500,"success");

    //Aca envio el push notification al METRE. Hay un nuevo cliente en la lista de espera
    // TO DO
    //----------------------------
    
    //Si la sesion es anonima el alta del consumidor se hace con el nombre del anonimo
    if (this.srvAuth.nombreDelAnonimo != undefined)
    {
      console.log("Dando de alta consumidor ANONIMO");
      console.log(this.srvAuth.nombreDelAnonimo);

      this.srvFirebase.alta_consumidor(this.srvAuth.nombreDelAnonimo);   

      setTimeout(() => 
      {
        this.arrayConsumidores.forEach(element => 
          {
            if (element.nombre == this.srvAuth.nombreDelAnonimo)
            {
              console.log("Encontrado el consumidor dado de alta! (QUE ERA ANONIMO)");
              console.log(this.consumidorActual);
              this.consumidorActual = element;
              this.consumidorFueCargado = true;
              this.clienteEnListaDeEspera = true;
            }
          });

      }, 2000);

    }
    else
    {
      //Si no, el alta del consumidor se hace con el mail del logeado
      let mailLogeado; 

      this.srvAuth.afAuth.user.subscribe((data) => 
      {
        mailLogeado = data.email;

        console.log("Dando de alta consumidor LOGEADO");
        console.log(mailLogeado);
        this.srvFirebase.alta_consumidor(mailLogeado); 

        setTimeout(() => 
        {
          this.arrayConsumidores.forEach(element => 
            {
              if (element.nombre == mailLogeado)
              {
                console.log("Encontrado el consumidor dado de alta! (QUE ERA CLIENTE REGISTRADO)");
                console.log(this.consumidorActual);
                this.consumidorActual = element;
                this.consumidorFueCargado = true;
                this.clienteEnListaDeEspera = true;
              }
            });
  
        }, 2000);

      });
     
    }
  }
}
