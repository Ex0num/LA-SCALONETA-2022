import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CamaraFotosService } from 'src/app/Servicios/camara-fotos.service';
import { FirebaseService } from 'src/app/Servicios/firebase.service';
import { GeneradorQrService } from 'src/app/Servicios/generador-qr.service';
import { SonidosPersonalizadosService } from 'src/app/Servicios/sonidos-personalizados.service';
import { ToastMsgService } from 'src/app/Servicios/toast-msg.service';

@Component({
  selector: 'app-alta-producto',
  templateUrl: './alta-producto.component.html',
  styleUrls: ['./alta-producto.component.scss'],
})
export class AltaProductoComponent implements OnInit {

  constructor(
    public srvCamara:CamaraFotosService,
    public srvGeneradorQR:GeneradorQrService,
    public srvFirebase:FirebaseService,
    public srvToast:ToastMsgService, 
    public srvSonidos:SonidosPersonalizadosService,
    public router:Router
  ) 
  {
    this.srvFirebase.listar_productos().subscribe((data)=>
    {
      this.arrayProductos = data;
      console.log(this.arrayProductos);
    })
  }

  ngOnInit() 
  {
   
    setTimeout( () => 
    {
      this.setearDataQR();
      
      setTimeout(async () => 
      {
        await this.obtenerSetearImagenQR();
      }, 2500);
          
    },2500);  
  }

  //#region ------------------------ Atributos ---------------------------------
  public sonidoActivado:boolean = true;

  //Este numero se carga en cuestion del ultimo numero de producto detectado en la DB.
  //El usuario no puede interactuar.
  public numeroGenerado_producto;
  public nombre_producto;
  public tipo_producto = "comida";
  public descripcion_producto = "";
  public tiempoEstimado_producto = undefined;
  public precio_producto;

  //El producto tiene 3 fotos
  public foto_producto1;
  public foto_producto2;
  public foto_producto3;

  public foto_productoQR;

  cargaQrFinalizada = false;

  //Atributos necesario para el <qrcode>
  public infoQRProducto;
  public emptyString = true;

  public arrayProductos:any = [];

  //#endregion -------------------------------------------------------------------

   //------------------ Funciones generales ---------------------
   public async abrirCamara1()
   {
     //Aca muestro la foto que sacó la camara
     let elementoHTML_fotoCamara = document.getElementById("imagen-camara-1");
 
     //Obtengo la foto y su URL para setearla
     let image:any =  await this.srvCamara.abrirCamaraDeFotos();
     let imageURL:any = await image.dataUrl;
 
     if (await image != undefined)
     {
       elementoHTML_fotoCamara.setAttribute("src", await imageURL);
       this.foto_producto1 = await imageURL;
     }
     else
     {
       //Si no hay foto asigno una foto en blanco.
       elementoHTML_fotoCamara.setAttribute("src","../../../assets/files/example-foto.PNG");
     }
   }

   public async abrirCamara2()
   {
     //Aca muestro la foto que sacó la camara
     let elementoHTML_fotoCamara = document.getElementById("imagen-camara-2");
 
     //Obtengo la foto y su URL para setearla
     let image:any =  await this.srvCamara.abrirCamaraDeFotos();
     let imageURL:any = await image.dataUrl;
 
     if (await image != undefined)
     {
       elementoHTML_fotoCamara.setAttribute("src", await imageURL);
       this.foto_producto2 = await imageURL;
     }
     else
     {
       //Si no hay foto asigno una foto en blanco.
       elementoHTML_fotoCamara.setAttribute("src","../../../assets/files/example-foto.PNG");
     }
   }

   public async abrirCamara3()
   {
     //Aca muestro la foto que sacó la camara
     let elementoHTML_fotoCamara = document.getElementById("imagen-camara-3");
 
     //Obtengo la foto y su URL para setearla
     let image:any =  await this.srvCamara.abrirCamaraDeFotos();
     let imageURL:any = await image.dataUrl;
 
     if (await image != undefined)
     {
       elementoHTML_fotoCamara.setAttribute("src", await imageURL);
       this.foto_producto3 = await imageURL;
     }
     else
     {
       //Si no hay foto asigno una foto en blanco.
       elementoHTML_fotoCamara.setAttribute("src","../../../assets/files/example-foto.PNG");
     }
   }
 
   actualizarTipoProducto(event:any)
     {
       this.tipo_producto = event.target.value;
 
       switch (this.tipo_producto) 
       {
         case 'Comida':
         {
           this.tipo_producto = "comida";
           break;
         }
         case 'Bebida':
         {
           this.tipo_producto = "bebida";
           break;
         }
       }
 
       console.log(this.tipo_producto);
   }
 
   async registrarProducto()
   {
     if (this.nombre_producto != "" && this.nombre_producto != undefined && this.nombre_producto != " " && this.precio_producto > 0 && this.foto_producto1 != undefined && this.foto_producto2 != undefined && this.foto_producto3 != undefined && this.tiempoEstimado_producto != undefined && this.tiempoEstimado_producto > 0 )
     {
        console.log(this.foto_producto1);
        console.log(this.foto_producto2);
        console.log(this.foto_producto3);
        console.log(this.foto_productoQR);

        await this.srvFirebase.alta_producto(
        "p_" + this.numeroGenerado_producto,
        this.nombre_producto,
        this.tipo_producto,
        this.precio_producto,
        this.descripcion_producto,
        this.foto_productoQR,
        this.foto_producto1,
        this.foto_producto2,
        this.foto_producto3,
        this.tiempoEstimado_producto
        ); 

        //Acciones finales
        this.srvToast.mostrarToast("bottom","El producto fue creado satisfactoriamente.",3000,"success");
        this.srvSonidos.reproducirSonido("slide",this.sonidoActivado);  
        this.limpiarDatosProductos();
         
        setTimeout(() => 
        {
          this.router.navigateByUrl("home");
        }, 800);  
     }
     else
     {
       console.log("Datos inválidos");
      
       if (this.nombre_producto == "" || this.nombre_producto == undefined || this.nombre_producto == " ")
       {
        this.srvToast.mostrarToast("bottom","El nombre del producto no puede ser nulo.",3000,"danger");
       }
       else if (this.precio_producto < 0)
      {
        this.srvToast.mostrarToast("bottom","El producto no puede tener un precio menor a 0.",3000,"danger");
      }
      else if (this.foto_producto1 == undefined || this.foto_producto2 == undefined || this.foto_producto3 == undefined)
      {
        this.srvToast.mostrarToast("bottom","Revise las fotos subidas. Faltan adjuntar.",3000,"danger");
      }
      else if (this.tiempoEstimado_producto == undefined || this.tiempoEstimado_producto <= 0 )
      {
        this.srvToast.mostrarToast("bottom","El tiempo estimado no puede ser igual o menor a 0 minutos.",3000,"danger");
      }

       this.srvSonidos.reproducirSonido("error",this.sonidoActivado);
     }
   }
 
   //Busca el ultimo numero de mesa y le hace ++ para asignarlo a esta nueva mesa
   public setearDataQR()
   {
     let lengthProductos = this.arrayProductos.length;
     lengthProductos++;
 
     //Info para el QR y para el producto
     this.infoQRProducto = "p_" + lengthProductos.toString();
     this.numeroGenerado_producto = lengthProductos.toString();
     console.log(lengthProductos);
     console.log(this.arrayProductos);
   }
 
   public async obtenerSetearImagenQR()
   {
      //Luego de que el QR se haya generado saco la foto rapidamente
      let elementoHTMLQR = document.getElementById("imagen-qr-deleteable-producto");
      let urlPublic = await this.srvGeneradorQR.crearImagen(elementoHTMLQR);
      
      this.foto_productoQR = urlPublic;
   }
 
   private limpiarDatosProductos()
   {
     this.nombre_producto = undefined;
     
     //Se "limpia" el archivo subido tmb
     this.foto_producto1 = undefined;
     this.foto_producto2 = undefined;
     this.foto_producto3 = undefined;
 
     let elementoHTMLImagenQR = document.getElementById("imagen-qr-producto");
     elementoHTMLImagenQR.setAttribute("src","../../../assets/files/example-foto.PNG");
   }

  // ------------- Funcionamiento de sonido ----------------------//
  public switchearEstadoSonido()
  {
    this.sonidoActivado = !this.sonidoActivado;
    let iconoSonido = document.getElementById("icono-sonido-altaProducto");
    
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
    
}
