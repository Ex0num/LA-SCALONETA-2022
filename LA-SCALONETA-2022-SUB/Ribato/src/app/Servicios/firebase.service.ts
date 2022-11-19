
import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc,collectionData, deleteDoc} from '@angular/fire/firestore';
import {getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Observable } from 'rxjs';
import {doc, query, updateDoc, where } from "firebase/firestore";
import { uploadString } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})

export class FirebaseService 
{

  //#region ----------------- Atributos - (Listas de las DB EN VIVO) ---------------------

    storage : any;
  
    anonimosCollectionReference : any;
    autoridadesCollectionReference : any;
    clientesCollectionReference : any;
    empleadosCollectionReference : any;
    mesasCollectionReference : any;
    consumidoresCollectionReference : any;
    mensajesCollectionReference : any;
    productosCollectionReference : any;
    pedidosCollectionReference : any;
    encuestasCollectionReference : any;

    // Push token
    usuariosCollectionReference : any;
    
  //#endregion ---------------------------------------------------------------------------
  

  constructor(public Firestore: Firestore) 
  {
    this.storage = getStorage();
    this.anonimosCollectionReference = collection(this.Firestore, 'anonimos');
    this.autoridadesCollectionReference = collection(this.Firestore, 'autoridades');
    this.clientesCollectionReference = collection(this.Firestore, 'clientes');
    this.empleadosCollectionReference = collection(this.Firestore, 'empleados');
    this.mesasCollectionReference = collection(this.Firestore, 'mesas');
    this.consumidoresCollectionReference = collection(this.Firestore, 'consumidores');
    this.mensajesCollectionReference = collection(this.Firestore, 'mensajes');
    this.productosCollectionReference = collection(this.Firestore, 'productos');
    this.pedidosCollectionReference = collection(this.Firestore, 'pedidos');
    this.encuestasCollectionReference = collection(this.Firestore, 'encuestas');

    // Esto es para saber el push-token 
    this.usuariosCollectionReference = collection(this.Firestore, 'usuarios');
  }

  //#region ---------------------- USUARIOS (SOLO PARA TOKEN DE PUSH-NOTIF) ---------------------------//
  public alta_usuario(usuario:any) 
  {
    return  addDoc(this.usuariosCollectionReference, usuario);
  }

  public listar_usuarios():Observable<any[]>
  {
    return collectionData(this.usuariosCollectionReference,{idField: 'id'}) as Observable<any[]>;
  }

  //#endregion ---------------------- USUARIOS (SOLO PARA TOKEN DE PUSH-NOTIF) ---------------------------//


  //#region ---------------------- CLIENTES NORMALES ---------------------------//

  public alta_clienteNormal(mailRecibido:string, passwordRecibida:string, nombreRecibido:string, apellidoRecibido:string, dniRecibido:string, fotoRecibida:any) 
  {
    //----------- Estructuracion de la entidad ---------------/
    let clienteEstructurado = 
    {
      correo: mailRecibido,
      password: passwordRecibida,
      nombre: nombreRecibido,
      apellido: apellidoRecibido,
      dni: dniRecibido,
      estado: 'pendiente',
      tipo: 'cliente',
      foto: fotoRecibida
    }

    //SUBO LA FOTO DE LA ENTIDAD AL STORAGE Y OBTENGO EL LINK PUBLICO. DESP, LO SUBO A LA DB Y CON LA NUEVA ID.
    let fechaValidaActual = new Date().toLocaleDateString();
    let horaValidaActual = new Date().toLocaleTimeString();
    do { fechaValidaActual = fechaValidaActual.replace("/",":"); } while(fechaValidaActual.includes("/"));

    //---------------
    let referenciaPathStorage = ref(this.storage, `images/clientes/${clienteEstructurado.correo + "/" + fechaValidaActual + "-" + horaValidaActual} `);
    //---------------

    uploadBytes(referenciaPathStorage, clienteEstructurado.foto).then((snapshot)=>
    {
      getDownloadURL(referenciaPathStorage).then((url)=>
      {
        clienteEstructurado.foto = url;

        // Push notif - token
        this.alta_usuario(clienteEstructurado);

        return  addDoc(this.clientesCollectionReference, clienteEstructurado);

      }).catch((error)=>
      {
        console.log(error);
      });
    });
  }

  public listar_clientesNormales():Observable<any[]>
  {
    return collectionData(this.clientesCollectionReference,{idField: 'id'}) as Observable<any[]>;
  }

  public modificar_clienteNormal(clienteRecibido:any, id:any)
  {
    const UsuarioDocRef = doc(this.Firestore, `clientes/${id}`);
    return updateDoc(UsuarioDocRef, clienteRecibido);
  }

  public baja_clienteNormal(idClienteRecibido: any)
  {
    const containerDocRef = doc(this.Firestore, `clientes/${idClienteRecibido}`);
    return deleteDoc(containerDocRef);
  }

  public validar_clienteNormal(mailRecibido:string, passwordRecibida:string, passwordConfirmRecibida:string ,nombreRecibido:string, apellidoRecibido:string, dniRecibido:string, fotoRecibida:any)
  {
    //----
    let datoInvalido = "ninguno";
    //----

    //Se empieza a validar, si no se encuentra nada, termina retornando valid.
    if (mailRecibido.includes("@") == false || mailRecibido == "" || mailRecibido == undefined || mailRecibido.length > 38)
    {
      datoInvalido = "mail";
    }

    if (passwordRecibida != passwordConfirmRecibida || passwordRecibida.length < 2 || passwordRecibida == undefined || passwordRecibida == "")
    {
      datoInvalido = "contraseña";
    }

    if (nombreRecibido.length < 2 || nombreRecibido.length > 30 || nombreRecibido == undefined || nombreRecibido == "")
    {
      datoInvalido = "nombre";
    }

    if (apellidoRecibido.length < 2 || nombreRecibido.length > 30 || nombreRecibido == undefined || nombreRecibido == "")
    {
      datoInvalido = "apellido";
    }

    if (dniRecibido.toString().length > 12 || dniRecibido.toString().length < 3)
    {
      datoInvalido = "dni";
    }

    if (fotoRecibida == undefined)
    { 
      datoInvalido = "foto";
    }

    return datoInvalido;
  }

  //#endregion ------------------------------------------------------------------//

  //#region ---------------------- CLIENTES ANONIMOS ---------------------------//

  public alta_clienteAnonimo(nombreRecibido:string, fotoRecibida:any) 
  {
    //----------- Estructuracion de la entidad ---------------/
    let clienteAnonimoEstructurado = 
    {
      nombre: nombreRecibido,
      foto: fotoRecibida
    }

    //SUBO LA FOTO DE LA ENTIDAD AL STORAGE Y OBTENGO EL LINK PUBLICO. DESP, LO SUBO A LA DB Y CON LA NUEVA ID.
    let fechaValidaActual = new Date().toLocaleDateString();
    let horaValidaActual = new Date().toLocaleTimeString();
    do { fechaValidaActual = fechaValidaActual.replace("/",":"); } while(fechaValidaActual.includes("/"));

    //---------------
    let referenciaPathStorage = ref(this.storage, `images/anonimos/${clienteAnonimoEstructurado.nombre + "/" + fechaValidaActual + "-" + horaValidaActual} `);
    //---------------

    uploadBytes(referenciaPathStorage, clienteAnonimoEstructurado.foto).then((snapshot)=>
    {
      getDownloadURL(referenciaPathStorage).then((url)=>
      {
        clienteAnonimoEstructurado.foto = url;

        // Push notif - token
        // this.alta_usuario(clienteAnonimoEstructurado);

        return  addDoc(this.anonimosCollectionReference, clienteAnonimoEstructurado);

      }).catch((error)=>
      {
        console.log(error);
      });
    });
  }

  public listar_clientesAnonimos():Observable<any[]>
  {
    return collectionData(this.anonimosCollectionReference,{idField: 'id'}) as Observable<any[]>;
  }

  public existe_clienteAnonimo(nombreRecibido, arrayClientesAnonimos):boolean
  {
    let existeClienteAnonConEseNombre = false;

    arrayClientesAnonimos.forEach( (element) => 
    {
      if (element["nombre"] == nombreRecibido)
      {
        existeClienteAnonConEseNombre = true;
      }
    });
   
    return existeClienteAnonConEseNombre;
  }

  //#endregion ------------------------------------------------------------------//

  //#region ---------------------------- AUTORIDADES ---------------------------//

  public alta_autoridad(mailRecibido:string, passwordRecibida:string, nombreRecibido:string, apellidoRecibido:string, dniRecibido:string, cuilRecibido:string, fotoRecibida:any) 
  {
    //----------- Estructuracion de la entidad ---------------/
    let autoridadEstructurada = 
    {
      correo: mailRecibido,
      password: passwordRecibida,
      nombre: nombreRecibido,
      apellido: apellidoRecibido,
      dni: dniRecibido,
      cuil: cuilRecibido,
      tipo: 'supervisor',
      foto: fotoRecibida
    }

    //SUBO LA FOTO DE LA ENTIDAD AL STORAGE Y OBTENGO EL LINK PUBLICO. DESP, LO SUBO A LA DB Y CON LA NUEVA ID.
    let fechaValidaActual = new Date().toLocaleDateString();
    let horaValidaActual = new Date().toLocaleTimeString();
    do { fechaValidaActual = fechaValidaActual.replace("/",":"); } while(fechaValidaActual.includes("/"));

    //---------------
    let referenciaPathStorage = ref(this.storage, `images/autoridades/${autoridadEstructurada.correo + "/" + fechaValidaActual + "-" + horaValidaActual} `);
    //---------------

    uploadBytes(referenciaPathStorage, autoridadEstructurada.foto).then((snapshot)=>
    {
      getDownloadURL(referenciaPathStorage).then((url)=>
      {
        autoridadEstructurada.foto = url;

        // Push notif - token
        this.alta_usuario(autoridadEstructurada);

        return  addDoc(this.autoridadesCollectionReference, autoridadEstructurada);

      }).catch((error)=>
      {
        console.log(error);
      });
    });
  }

  public listar_autoridades():Observable<any[]>
  {
    return collectionData(this.autoridadesCollectionReference,{idField: 'id'}) as Observable<any[]>
  }

  public validar_autoridad(mailRecibido:string, passwordRecibida:string, passwordConfirmRecibida:string ,nombreRecibido:string, apellidoRecibido:string, dniRecibido:string, cuilRecibido:string ,fotoRecibida:any)
  {
    //----
    let datoInvalido = "ninguno";
    //----

    //Se empieza a validar, si no se encuentra nada, termina retornando valid.
    if (mailRecibido.includes("@") == false || mailRecibido == "" || mailRecibido == undefined || mailRecibido.length > 38)
    {
      datoInvalido = "mail";
    }

    if (passwordRecibida != passwordConfirmRecibida || passwordRecibida.length <= 1 || passwordRecibida == undefined || passwordRecibida == "")
    {
      datoInvalido = "contraseña";
    }

    if (nombreRecibido.length < 2 || nombreRecibido.length > 30 || nombreRecibido == undefined || nombreRecibido == "")
    {
      datoInvalido = "nombre";
    }

    if (apellidoRecibido.length < 2 || nombreRecibido.length > 30 || nombreRecibido == undefined || nombreRecibido == "")
    {
      datoInvalido = "apellido";
    }

    if (dniRecibido.toString().length > 20 || dniRecibido.toString().length < 3)
    {
      datoInvalido = "dni";
    }

    if (fotoRecibida == undefined)
    { 
      datoInvalido = "foto";
    }

    if(cuilRecibido == undefined || cuilRecibido.length > 25 || cuilRecibido.length < 3 || cuilRecibido == "")
    {
      datoInvalido = "cuil";
    }

    return datoInvalido;
  }

  //#endregion ------------------------------------------------------------------//

  //#region ------------------------------- MESAS ------------------------------//
  public alta_mesa(numeroMesaRecibido:string, cantidadComensalesRecibida:number, tipoMesaRecibido:string, fotoQRRecibida:any, fotoMesaRecibida:any)
  {
    //----------- Estructuracion de la entidad ---------------/
    let mesaEstructurada = 
    {
      numeroMesa: numeroMesaRecibido,
      comensales: cantidadComensalesRecibida,
      fotoQR: fotoQRRecibida,
      fotoMesa: fotoMesaRecibida,
      tipo: tipoMesaRecibido,
      estado: 'disponible'
    }

    //SUBO LA FOTO DE LA ENTIDAD AL STORAGE Y OBTENGO EL LINK PUBLICO. DESP, LO SUBO A LA DB Y CON LA NUEVA ID.
    let fechaValidaActual = new Date().toLocaleDateString();
    let horaValidaActual = new Date().toLocaleTimeString();
    do { fechaValidaActual = fechaValidaActual.replace("/",":"); } while(fechaValidaActual.includes("/"));

    //---------------
    let referenciaPathStorage = ref(this.storage, `images/mesas/${mesaEstructurada.numeroMesa + "/" + fechaValidaActual + "-" + horaValidaActual + "-v1"} `);
    let referenciaPathStorage2 = ref(this.storage, `images/mesas/${mesaEstructurada.numeroMesa + "/" + fechaValidaActual + "-" + horaValidaActual + "-v2"} `);
    //---------------

    uploadString(referenciaPathStorage, mesaEstructurada.fotoMesa, 'data_url').then((data)=>
    {
        getDownloadURL(referenciaPathStorage).then((url)=>
        {
          mesaEstructurada.fotoMesa = url;
          
          uploadString(referenciaPathStorage2, mesaEstructurada.fotoQR, 'data_url').then((data)=>
          {  
              getDownloadURL(referenciaPathStorage2).then((url)=>
              {
                mesaEstructurada.fotoQR = url;
                return  addDoc(this.mesasCollectionReference, mesaEstructurada);
        
              }).catch((error)=>
              {
                console.log(error);
              });
          
          });

        }).catch((error)=>
        {
          console.log(error);
        });
    });

  }

  public listar_mesas():Observable<any[]>
  {
    return collectionData(this.mesasCollectionReference,{idField: 'id'}) as Observable<any[]>;
  }

  public modificar_mesa(mesaRecibida:any, id:any)
  {
    let mesaDocRef = doc(this.Firestore, `mesas/${id}`);
    return updateDoc(mesaDocRef, mesaRecibida);
  }

  //#endregion ------------------------------------------------------------------//

  //#region ----------------------------- EMPLEADOS ----------------------------//

  public alta_empleado(mailRecibido:string, passwordRecibida:string, nombreRecibido:string, apellidoRecibido:string, dniRecibido:string, tipoRecibido:string,cuilRecibido:string, fotoRecibida:any)
  {
    //----------- Estructuracion de la entidad ---------------/
    let empleadoEstructurado = 
    {
      correo: mailRecibido,
      password: passwordRecibida,
      nombre: nombreRecibido,
      apellido: apellidoRecibido,
      dni: dniRecibido,
      cuil: cuilRecibido,
      tipo: tipoRecibido,
      foto: fotoRecibida
    }

    //SUBO LA FOTO DE LA ENTIDAD AL STORAGE Y OBTENGO EL LINK PUBLICO. DESP, LO SUBO A LA DB Y CON LA NUEVA ID.
    let fechaValidaActual = new Date().toLocaleDateString();
    let horaValidaActual = new Date().toLocaleTimeString();
    do { fechaValidaActual = fechaValidaActual.replace("/",":"); } while(fechaValidaActual.includes("/"));

    //---------------
    let referenciaPathStorage = ref(this.storage, `images/empleados/${empleadoEstructurado.tipo + "/" + empleadoEstructurado.correo + "/" + empleadoEstructurado.dni + "-" + fechaValidaActual + "-" + horaValidaActual} `);
    //---------------

    uploadBytes(referenciaPathStorage, empleadoEstructurado.foto).then((snapshot)=>
    {
      getDownloadURL(referenciaPathStorage).then((url)=>
      {
        empleadoEstructurado.foto = url;

        // Push notif - token
        this.alta_usuario(empleadoEstructurado);

        return  addDoc(this.empleadosCollectionReference, empleadoEstructurado);

      }).catch((error)=>
      {
        console.log(error);
      });
    });
  }

  public validar_empleado(mailRecibido:string, passwordRecibida:string, passwordConfirmRecibida:string ,nombreRecibido:string, apellidoRecibido:string, dniRecibido:string, tipoRecibido:string, cuilRecibido:string ,fotoRecibida:any)
  {
    //----
    let datoInvalido = "ninguno";
    //----

    //Se empieza a validar, si no se encuentra nada, termina retornando valid.
    if (mailRecibido.includes("@") == false || mailRecibido == "" || mailRecibido == undefined || mailRecibido.length > 38)
    {
      datoInvalido = "mail";
    }

    if (passwordRecibida != passwordConfirmRecibida || passwordRecibida.length <= 1 || passwordRecibida == undefined || passwordRecibida == "")
    {
      datoInvalido = "contraseña";
    }

    if (nombreRecibido.length < 2 || nombreRecibido.length > 30 || nombreRecibido == undefined || nombreRecibido == "")
    {
      datoInvalido = "nombre";
    }

    if (apellidoRecibido.length < 2 || nombreRecibido.length > 30 || nombreRecibido == undefined || nombreRecibido == "")
    {
      datoInvalido = "apellido";
    }

    if (dniRecibido.toString().length > 20 || dniRecibido.toString().length < 3)
    {
      datoInvalido = "dni";
    }

    //La foto del empleado puede ser undefined en el alta (En ese caso se sube una foto 'predeterminada')
    // if (fotoRecibida == undefined)
    // { 
    //   datoInvalido = "foto";
    // }

    if(cuilRecibido == undefined || cuilRecibido.length > 25 || cuilRecibido.length < 3 || cuilRecibido == "")
    {
      datoInvalido = "cuil";
    }

    if(
      tipoRecibido !=  "supervisor" && 
      tipoRecibido != "dueno" && 
      tipoRecibido != "cocinero" && 
      tipoRecibido != "metre" && 
      tipoRecibido != "mozo" && 
      tipoRecibido != "bartender" &&
      tipoRecibido != "cliente" &&
      tipoRecibido != "anonimo")
    {
      datoInvalido = "tipo";
    }

    return datoInvalido;
  }

  public listar_empleados():Observable<any[]>
  { 
    return collectionData(this.empleadosCollectionReference,{idField: 'id'}) as Observable<any[]>;
  }

  //#endregion ------------------------------------------------------------------//

  //#region ----------------------------- CONSUMIDORES ----------------------------//

  public alta_consumidor(nombreRecibido:string)
  {
    //----------- Estructuracion de la entidad ---------------/
    let consumidorEstructurado = 
    {
      nombre: nombreRecibido,
      estado: 'esperando_mesa',
      mesaAsignada: 'ninguna',
    }

    return  addDoc(this.consumidoresCollectionReference, consumidorEstructurado);
  }
  
  public listar_consumidores():Observable<any[]>
  { 
    return collectionData(this.consumidoresCollectionReference,{idField: 'id'}) as Observable<any[]>;
  }

  public modificar_consumidor(consumidorRecibido:any, id:any)
  {
    let consumidorDocRef = doc(this.Firestore, `consumidores/${id}`);
    return updateDoc(consumidorDocRef, consumidorRecibido);
  }
  
  //#endregion ------------------------------------------------------------------//
  
  //#region ----------------------------- MENSAJES ----------------------------//

  public alta_mensaje(textoRecibido, nombreEmisorRecibido, tipoEmisorRecibido, numeroMesaRecibido)
  {
    let fecha = new Date();
    let fechaActual = fecha.toLocaleDateString();
  
    let hora = new Date();
    let horaActual = hora.toLocaleTimeString();

    //----------- Estructuracion de la entidad ---------------/
    let mensajeEstructurado = 
    {
      texto: textoRecibido,
      emisor: nombreEmisorRecibido,
      tipo: tipoEmisorRecibido,
      fecha: fechaActual,
      hora: horaActual,
      numMesa: numeroMesaRecibido
    }

    console.log("Subiendo mensaje...");
    console.log(mensajeEstructurado);

    return  addDoc(this.mensajesCollectionReference, mensajeEstructurado);
  }
  
  public listar_mensajes():Observable<any[]>
  { 
    return collectionData(this.mensajesCollectionReference,{idField: 'id'}) as Observable<any[]>;
  }

  //#endregion ------------------------------------------------------------------//

  //#region ----------------------------- PRODUCTOS ----------------------------//

  public alta_producto(numeroGeneradoRecibido, nombreRecibido, tipoRecibido, precioRecibido, descripcionRecibida, fotoQRRecibida, foto1Recibida, foto2Recibida, foto3Recibida, tiempoEstimado)
  {
    //----------- Estructuracion de la entidad ---------------/
    let productoEstructurado = 
    {
      numeroProducto: numeroGeneradoRecibido,
      nombre: nombreRecibido,
      precio: precioRecibido,
      descripcion: descripcionRecibida,
      fotoQR: fotoQRRecibida,
      foto1: foto1Recibida,
      foto2: foto2Recibida,
      foto3: foto3Recibida,
      tipo: tipoRecibido,
      minutosPreparacion: tiempoEstimado
    }

    //SUBO LA FOTO DE LA ENTIDAD AL STORAGE Y OBTENGO EL LINK PUBLICO. DESP, LO SUBO A LA DB Y CON LA NUEVA ID.
    let fechaValidaActual = new Date().toLocaleDateString();
    let horaValidaActual = new Date().toLocaleTimeString();
    do { fechaValidaActual = fechaValidaActual.replace("/",":"); } while(fechaValidaActual.includes("/"));

    //---------------
    let referenciaPathStorage = ref(this.storage, `images/productos/${productoEstructurado.numeroProducto + "/" + fechaValidaActual + "-" + horaValidaActual + "-v1"} `);
    let referenciaPathStorage2 = ref(this.storage, `images/productos/${productoEstructurado.numeroProducto + "/" + fechaValidaActual + "-" + horaValidaActual + "-v2"} `);
    let referenciaPathStorage3 = ref(this.storage, `images/productos/${productoEstructurado.numeroProducto + "/" + fechaValidaActual + "-" + horaValidaActual + "-v3"} `);
    let referenciaPathStorage4 = ref(this.storage, `images/productos/${productoEstructurado.numeroProducto + "/" + fechaValidaActual + "-" + horaValidaActual + "-v4"} `);
    //---------------

    uploadString(referenciaPathStorage, productoEstructurado.foto1, 'data_url').then((data)=>
    {
        getDownloadURL(referenciaPathStorage).then((url)=>
        {
          productoEstructurado.foto1 = url;
          
          uploadString(referenciaPathStorage2, productoEstructurado.fotoQR, 'data_url').then((data)=>
          {  
              getDownloadURL(referenciaPathStorage2).then((url)=>
              {
                productoEstructurado.fotoQR = url;
                
                uploadString(referenciaPathStorage3, productoEstructurado.foto2, 'data_url').then((data)=>
                {  
                    getDownloadURL(referenciaPathStorage3).then((url)=>
                    {
                      productoEstructurado.foto2 = url;

                      uploadString(referenciaPathStorage4, productoEstructurado.foto3, 'data_url').then((data)=>
                      {  
                          getDownloadURL(referenciaPathStorage4).then((url)=>
                          {
                            productoEstructurado.foto3 = url;
                            return  addDoc(this.productosCollectionReference, productoEstructurado)
      
                          }).catch((error)=>
                          {
                            console.log(error);
                          });
                      });
              
                    }).catch((error)=>
                    {
                      console.log(error);
                    });
                });
        
              }).catch((error)=>
              {
                console.log(error);
              });
          });   

        }).catch((error)=>
        {
          console.log(error);
        });
    });

  }
  
  public listar_productos():Observable<any[]>
  {
    return collectionData(this.productosCollectionReference,{idField: 'id'}) as Observable<any[]>;
  }
  //#endregion ------------------------------------------------------------------//
  
  //#region ----------------------------- PEDIDOS ----------------------------//
  public alta_pedido(consumidorNombreRecibido, carritoBarRecibido, carritoCocinaRecibido, numeroMesaRecibido)
  {
    let resultadoEstadoBar;
    let resultadoEstadoCocina;

    //Me fijo si carrito (tanto de cocina como de bar) tienen algo. Si lo tienen su estado es finalizado = false
    if (carritoBarRecibido.length > 0) {resultadoEstadoBar = false;} else {resultadoEstadoBar = true;}
    if (carritoCocinaRecibido.length > 0) {resultadoEstadoCocina = false;} else {resultadoEstadoCocina = true;}

    //----------- Estructuracion de la entidad ---------------/
    let pedidoEstructurado = 
    {
      consumidor: consumidorNombreRecibido,
      carrito_bar : carritoBarRecibido,
      carrito_cocina : carritoCocinaRecibido,
      estado: 'esperando_aceptacion',
      estado_bar_finalizado: resultadoEstadoBar,
      estado_cocina_finalizado: resultadoEstadoCocina,
      mozo: '',
      mesa: numeroMesaRecibido
    }

    return  addDoc(this.pedidosCollectionReference, pedidoEstructurado);
  }
    
  public listar_pedidos():Observable<any[]>
  {
    return collectionData(this.pedidosCollectionReference,{idField: 'id'}) as Observable<any[]>;
  }

  public modificar_pedido(pedidoRecibido:any, id:any)
  {
    let pedidoDocRef = doc(this.Firestore, `pedidos/${id}`);
    return updateDoc(pedidoDocRef, pedidoRecibido);
  }
  //#endregion ------------------------------------------------------------------//
    
  //#region ----------------------------- ENCUESTAS ----------------------------//
  public alta_encuesta(respuestaComidaRica, respuestaAtencionEmpleados, respuestaPreciosAcordes)
  {
    //----------- Estructuracion de la entidad ---------------/
    let encuestaEstructurado = 
    {
      comidaRica: respuestaComidaRica,
      atencionEmpleados : respuestaAtencionEmpleados,
      preciosAcordes : respuestaPreciosAcordes,   
    }

    return  addDoc(this.encuestasCollectionReference, encuestaEstructurado);
  }
    
  public listar_encuestas():Observable<any[]>
  {
    return collectionData(this.encuestasCollectionReference,{idField: 'id'}) as Observable<any[]>;
  }
  
  //#endregion ------------------------------------------------------------------//
      
}

