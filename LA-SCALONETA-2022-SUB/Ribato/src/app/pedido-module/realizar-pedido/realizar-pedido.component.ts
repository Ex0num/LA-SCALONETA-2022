import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Servicios/auth.service';
import { FirebaseService } from 'src/app/Servicios/firebase.service';
import { SonidosPersonalizadosService } from 'src/app/Servicios/sonidos-personalizados.service';
import { ToastMsgService } from 'src/app/Servicios/toast-msg.service';

@Component({
  selector: 'app-realizar-pedido',
  templateUrl: './realizar-pedido.component.html',
  styleUrls: ['./realizar-pedido.component.scss'],
})
export class RealizarPedidoComponent implements OnInit {

  constructor(
    public srvFirebase:FirebaseService,
    public srvAuth:AuthService,
    public srvToast:ToastMsgService, 
    public srvSonidos:SonidosPersonalizadosService,
    public router:Router
  ) 
  { 
    this.srvFirebase.listar_productos().subscribe((data)=>
    {
      this.arrayProductos = data;
    });

    this.srvFirebase.listar_consumidores().subscribe((data)=>
    {
      this.arrayConsumidores = data;
    });
  }

  ngOnInit() 
  {
    setTimeout(() => 
    {
      this.spinnerMostrandose = false;
    }, 1500);
  }

  //------------------------ Atributos ---------------------------- //

    sonidoActivado:boolean = true;
    spinnerMostrandose:boolean = true;
  
    arrayProductos:any = [];

    //Yo necesito saber QUIEN es el consumidor actual cosa de cambiarle el estado posteriormente
    arrayConsumidores:any = [];

    arrayProductosCarrito:any = [];
    importeAcumulado = 0;
    tiempoEstimado = 0;

  //------------------------------------------------------------------- //

  sumarProducto(productoRecibido:any)
  {
    this.arrayProductosCarrito.push(productoRecibido);
    this.importeAcumulado = this.importeAcumulado + productoRecibido.precio;
    console.log(this.arrayProductosCarrito);

    //Verifico si el tiempo estimado actual es menor al que se esta agregando como producto
    if (this.tiempoEstimado < productoRecibido.minutosPreparacion)
    {
      this.tiempoEstimado = productoRecibido.minutosPreparacion;
    }   
  }

  restarProducto(productoRecibido:any)
  {
    let contadorUnico = 0;

    if (this.importeAcumulado > 0 && this.arrayProductosCarrito.length > 0)
    {
      this.arrayProductosCarrito = this.arrayProductosCarrito.filter((element)=>
      {
        if (element.numeroProducto == productoRecibido.numeroProducto && contadorUnico == 0)
        {
          
          console.log("Encontre a un producto con ese nombre, se filtra");
          console.log(element.numeroProducto + productoRecibido.numeroProducto);
          this.importeAcumulado = this.importeAcumulado - element.precio;
          contadorUnico++;

          return 0;
        }
        else
        {
          return -1;
        }
      });

        this.tiempoEstimado = this.actualizarTiempoEstimado();
    }
    else
    {
      this.srvToast.mostrarToast("top","No se puede eliminar un producto del carrito si está vacío.",2500,"danger");
      this.srvSonidos.reproducirSonido("error",this.sonidoActivado);
    }

    console.log(this.arrayProductosCarrito);
  }

  actualizarTiempoEstimado()
  {
    let maxValue;

    if (this.arrayProductosCarrito.length <= 0)
    {
      maxValue = 0;
    }
    else
    {
      this.arrayProductosCarrito.forEach((element, index) => 
      {
          if( index == 0)
          {
            maxValue = element.minutosPreparacion;
          }
          else if (this.tiempoEstimado < element.minutosPreparacion)
          {
            this.tiempoEstimado = element.minutosPreparacion;
          }
      });
    }
  
    console.log("MAX CALCULATED: " + maxValue);
    return maxValue;
  }

  enviarPedido()
  {
    if (this.srvAuth.pedidoEnviado == true)
    {
      this.srvToast.mostrarToast("top","No se puede volver a enviar un pedido si ya enviaste uno.",2500,"danger");
      this.srvSonidos.reproducirSonido("error",this.sonidoActivado);
      this.router.navigateByUrl("clientes-esperando-pedido");
    }
    else
    {
      if (this.importeAcumulado > 0 && this.arrayProductosCarrito.length > 0)
      {
        console.log(this.arrayProductosCarrito);
        this.srvAuth.pedidoEnviado = true;

        let carritoBar = this.arrayProductosCarrito.filter( (producto) => 
        {
            if(producto.tipo != 'comida')
            {
              return -1;
            }
            else
            {
              return 0;
            }
        }); 

        let carritoCocina = this.arrayProductosCarrito.filter( (producto) => 
        {
            if(producto.tipo != 'bebida')
            {
              return -1;
            }
            else
            {
              return 0;
            }
        }); 
        
        console.log("CARRITO BAR: ");
        console.log(carritoBar);

        console.log("CARRITO COCINA: ");
        console.log(carritoCocina);

        let carritoBarNombres = new Array();
        let carritoCocinaNombres = new Array();

        carritoBar.forEach(bebida => 
        {
          carritoBarNombres.push(bebida.nombre);
        });

        carritoCocina.forEach(comida => 
        {
          carritoCocinaNombres.push(comida.nombre);
        });

        //---

        let consumidorActual;

        if (this.srvAuth.nombreDelAnonimo != undefined) //Es un anonimo, le seteo el nombre del anonimo
        {
          consumidorActual = this.buscarConsumidor(this.srvAuth.nombreDelAnonimo);           
          consumidorActual.estado = 'esperando_pedido';
          this.srvFirebase.modificar_consumidor(consumidorActual, consumidorActual.id);

          this.srvFirebase.alta_pedido(this.srvAuth.nombreDelAnonimo, carritoBarNombres, carritoCocinaNombres, consumidorActual.mesaAsignada);
        }
        else //Es un cliente logeado, le seteo el mail del auth logeado
        {
          consumidorActual = this.buscarConsumidor(this.srvAuth.userLogedData.email);           
          consumidorActual.estado = 'esperando_pedido';
          this.srvFirebase.modificar_consumidor(consumidorActual, consumidorActual.id);

          this.srvFirebase.alta_pedido(this.srvAuth.userLogedData.email, carritoBarNombres, carritoCocinaNombres, consumidorActual.mesaAsignada); 
        }

        //Me lo guardo en srvAuth por si mas adelante necesito saber de vuelta la informacion del consumidor
        //this.srvAuth.dataConsumidor = consumidorActual;
        //No lo guardo tdvia xq yo no se al cambiar algo en la DB del consumidor tmb se actualiza ahi en el srv.Auth o queda con los datos viejos
        //---

        this.srvToast.mostrarToast("top","Su pedido fue dado de alta satisfactoriamente ¡Un mozo lo gestionará lo antes posible!.",2500,"success");
        this.srvSonidos.reproducirSonido("login",this.sonidoActivado);
        this.router.navigateByUrl("clientes-esperando-pedido");
      }
      else
      {
        this.srvToast.mostrarToast("top","No se puede enviar un pedido vacío.",2500,"danger");
        this.srvSonidos.reproducirSonido("error",this.sonidoActivado);
      }
    }
  }

  buscarConsumidor(nombreConsumidor:string)
  {
    let consumidorActual;

    this.arrayConsumidores.forEach(consumidor => 
    {
      if (consumidor.nombre == nombreConsumidor && consumidor.estado == 'realizando_pedido')
      {
          consumidorActual = consumidor;
      }
    });

    return consumidorActual;
  }
  
  //------------- Funcionamiento de sonido --------------------------
   
  switchearEstadoSonido()
    {
      this.sonidoActivado = !this.sonidoActivado;
      let iconoSonido = document.getElementById("icono-sonido-realizarPedido");

      if (this.sonidoActivado == true)
      {
        iconoSonido.setAttribute("name","volume-mute");
      }
      else
      {
        iconoSonido.setAttribute("name","radio");
      }
  }

}
