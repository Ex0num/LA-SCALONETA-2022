
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
    anonimos;

    autoridadesCollectionReference : any;
    autoridades;

    clientesCollectionReference : any;
    clientes;

    empleadosCollectionReference : any;
    empleados;

    mesasCollectionReference : any;
    mesas;

  //#endregion ---------------------------------------------------------------------------
  

  constructor(public Firestore: Firestore) 
  {
    this.storage = getStorage();
    this.anonimosCollectionReference = collection(this.Firestore, 'anonimos');
    this.autoridadesCollectionReference = collection(this.Firestore, 'autoridades');
    this.clientesCollectionReference = collection(this.Firestore, 'clientes');
    this.empleadosCollectionReference = collection(this.Firestore, 'empleados');
    this.mesasCollectionReference = collection(this.Firestore, 'mesas');

    this.listar_clientesNormales();
    this.listar_clientesAnonimos();
    this.listar_autoridades();
    this.listar_mesas();
    this.listar_empleados();
  }

  //#region ---------------------- CLIENTES NORMALES ---------------------------//

  public alta_clienteNormal(mailRecibido:string, passwordRecibida:string, nombreRecibido:string, apellidoRecibido:string, dniRecibido:number, fotoRecibida:any) 
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
        return  addDoc(this.clientesCollectionReference, clienteEstructurado);

      }).catch((error)=>
      {
        console.log(error);
      });
    });
  }

  public listar_clientesNormales():Observable<any[]>
  {
    
    let observable = collectionData(this.clientesCollectionReference,{idField: 'id'}) as Observable<any[]>;

    observable.subscribe(clientesLeidos =>
    {
      this.clientes = clientesLeidos;
    })

    return this.clientes;
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

  public validar_clienteNormal(mailRecibido:string, passwordRecibida:string, passwordConfirmRecibida:string ,nombreRecibido:string, apellidoRecibido:string, dniRecibido:number, fotoRecibida:any)
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

    if (dniRecibido.toString().length > 10 || dniRecibido.toString().length < 3)
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
        return  addDoc(this.anonimosCollectionReference, clienteAnonimoEstructurado);

      }).catch((error)=>
      {
        console.log(error);
      });
    });
  }

  public listar_clientesAnonimos():Observable<any[]>
  {
    
    let observable = collectionData(this.anonimosCollectionReference,{idField: 'id'}) as Observable<any[]>;

    observable.subscribe(anonimosLeidos =>
    {
      this.anonimos = anonimosLeidos;
    })

    return this.anonimos;
  }

  public existe_clienteAnonimo(nombreRecibido):boolean
  {
    let existeClienteAnonConEseNombre = false;

    this.anonimos.forEach( (element) => 
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

  public alta_autoridad(mailRecibido:string, passwordRecibida:string, nombreRecibido:string, apellidoRecibido:string, dniRecibido:number, cuilRecibido:string, fotoRecibida:any) 
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
        return  addDoc(this.autoridadesCollectionReference, autoridadEstructurada);

      }).catch((error)=>
      {
        console.log(error);
      });
    });
  }

  public listar_autoridades():Observable<any[]>
  {
    
    let observable = collectionData(this.autoridadesCollectionReference,{idField: 'id'}) as Observable<any[]>;

    observable.subscribe(autoridadesLeidas =>
    {
      this.autoridades = autoridadesLeidas;
    })

    return this.autoridades;
  }

  public validar_autoridad(mailRecibido:string, passwordRecibida:string, passwordConfirmRecibida:string ,nombreRecibido:string, apellidoRecibido:string, dniRecibido:number, cuilRecibido:string ,fotoRecibida:any)
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

    if (dniRecibido.toString().length > 10 || dniRecibido.toString().length < 3)
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
      tipo: tipoMesaRecibido
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

      }).catch((error)=>
      {
        console.log(error);
      });
    });

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
  }

  public listar_mesas():Observable<any[]>
  {
    
    let observable = collectionData(this.mesasCollectionReference,{idField: 'id'}) as Observable<any[]>;

    observable.subscribe(mesasLeidas =>
    {
      this.mesas = mesasLeidas;
    })

    return this.mesas;
  }

  //#endregion ------------------------------------------------------------------//

  //#region ----------------------------- EMPLEADOS ----------------------------//

  public alta_empleado(mailRecibido:string, passwordRecibida:string, nombreRecibido:string, apellidoRecibido:string, dniRecibido:number, tipoRecibido:string,cuilRecibido:string, fotoRecibida:any)
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
        return  addDoc(this.empleadosCollectionReference, empleadoEstructurado);

      }).catch((error)=>
      {
        console.log(error);
      });
    });
  }

  public validar_empleado(mailRecibido:string, passwordRecibida:string, passwordConfirmRecibida:string ,nombreRecibido:string, apellidoRecibido:string, dniRecibido:number, tipoRecibido:string, cuilRecibido:string ,fotoRecibida:any)
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

    if (dniRecibido.toString().length > 10 || dniRecibido.toString().length < 3)
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
    
    let observable = collectionData(this.empleadosCollectionReference,{idField: 'id'}) as Observable<any[]>;

    observable.subscribe(empleadosLeidos =>
    {
      this.empleados = empleadosLeidos;
    })

    return this.empleados;
  }

  //#endregion ------------------------------------------------------------------//
  
  // -- G E N E R A L E S ---
  public buscar_UsuarioPorMail(mailRecibido:string)
  {
    let usuarioEncontrado:any;

    //Leo todas las DB
    let arrayClientes = this.clientes;
    let arrayEmpleados = this.empleados;
    let arrayAutoridades = this.autoridades;

    //Como esto no esto no es tan optimo, no voy a seguir leyendo mas tablas 
    //si ya encontre un usuario...

    if (usuarioEncontrado == undefined)
    {
      (arrayClientes).forEach((cliente) => 
      {
        if (cliente["correo"] != undefined && cliente["correo"].toLowerCase()  == mailRecibido.toLowerCase())
        {
          usuarioEncontrado = cliente;
        }
      });
    }

    if (usuarioEncontrado == undefined)
    {
      (arrayEmpleados).forEach((empleado) => 
      {
        if (empleado["correo"] != undefined && empleado["correo"].toLowerCase()  == mailRecibido.toLowerCase())
        {
          usuarioEncontrado = empleado;
        }
      });
    }

    if (usuarioEncontrado == undefined)
    {
      (arrayAutoridades).forEach((autoridad) => 
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

