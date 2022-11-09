import { Injectable } from '@angular/core';
import { collection, doc, Firestore, getDocs, getFirestore, setDoc, updateDoc } from 'firebase/firestore/lite';
import { getDownloadURL, ref, uploadBytes, uploadString, getStorage } from '@firebase/storage'
import { anonimos, autoridades, clientes, db, empleados, mesas, storage } from '../app.component';
import { QRCode} from '../../../node_modules/qrcode';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor() {}


  //#region ---------------------- CLIENTES ---------------------------//

  //Estructura los datos recibidos y llama a subirFotoClienteNormal
  public async subirClienteNormalDB(mailRecibido:string, passwordRecibida:string, nombreRecibido:string, apellidoRecibido:string, dniRecibido:number, fotoRecibida:any) 
  {
    
    //Estructuro el paciente
    let clienteEstructurado = 
    {
      correo: mailRecibido,
      password: passwordRecibida,
      nombre: nombreRecibido,
      apellido: apellidoRecibido,
      dni: dniRecibido,
      estado: 'desaprobado',
      foto: fotoRecibida
    }

    this.subirFotoClienteNormal(clienteEstructurado.foto, clienteEstructurado);
  }

  public async subirClienteAnonimoDB(nombreRecibido:string, fotoRecibida:any) 
  {
    
    //Estructuro el paciente
    let clienteAnonimoEstructurado = 
    {
      nombre: nombreRecibido,
      foto: fotoRecibida
    }

    console.log(fotoRecibida);

    this.subirFotoClienteAnonimo(clienteAnonimoEstructurado.foto, clienteAnonimoEstructurado);
  }

  public async existeClienteAnonimo(nombreRecibido:string)
  {
    let existeClienteAnonConEseNombre = false;
    let arrayAnonimos = await this.leerAnonimosDB();

    arrayAnonimos.forEach( (element) => 
    {
      if (element["nombre"] == nombreRecibido)
      {
        existeClienteAnonConEseNombre = true;
      }
    });

    return existeClienteAnonConEseNombre;
  }

  //Valida datos de un cliente - Retorna el dato incorrecto
  public validarClienteNormalDB(mailRecibido:string, passwordRecibida:string, passwordConfirmRecibida:string ,nombreRecibido:string, apellidoRecibido:string, dniRecibido:number, fotoRecibida:any)
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

  //Sube la foto a Storage y sube el cliente ya con todos los datos cargados (inclusive el link publico de la foto)
  private async subirFotoClienteNormal(filePhotoRecibido:any, clienteNormalEstructuradoRecibido:any)
  {
    //Leo db y me fijo la ultima ID. 
    let lastId = this.getLastIDClientesNormales();
    let newID = await lastId + 1;

    //SUBO LA FOTO DE LA ENTIDAD AL STORAGE Y OBTENGO EL LINK PUBLICO. DESP, LO SUBO A LA DB Y CON LA NUEVA ID.
    let fechaValidaActual = new Date().toLocaleDateString();
    let horaValidaActual = new Date().toLocaleTimeString();
    do { fechaValidaActual = fechaValidaActual.replace("/",":"); } while(fechaValidaActual.includes("/"));

    //---------------
    let referenciaPathStorage = ref(storage, `images/clientes/${clienteNormalEstructuradoRecibido.correo + "/" + clienteNormalEstructuradoRecibido.dni + "-" + fechaValidaActual + "-" + horaValidaActual} `);
    //---------------

    console.log(filePhotoRecibido);

    await uploadBytes(referenciaPathStorage, filePhotoRecibido).then(async (snapshot)=>
    {
      await getDownloadURL(referenciaPathStorage).then(async (url)=>
      { 
        clienteNormalEstructuradoRecibido.foto = url;
      });
    }).catch( () => { console.log("Error");})
    
    console.log(clienteNormalEstructuradoRecibido);
    
    let newDocument = doc(db, "clientes", newID.toString());
    await setDoc(newDocument, clienteNormalEstructuradoRecibido);
  }

  private async subirFotoClienteAnonimo(filePhotoRecibido:any, clienteAnonimoEstructuradoRecibido:any)
  {
    //Leo db y me fijo la ultima ID. 
    let lastId = this.getLastIDClientesAnonimos();
    let newID = await lastId + 1;

    //SUBO LA FOTO DE LA ENTIDAD AL STORAGE Y OBTENGO EL LINK PUBLICO. DESP, LO SUBO A LA DB Y CON LA NUEVA ID.
    let fechaValidaActual = new Date().toLocaleDateString();
    let horaValidaActual = new Date().toLocaleTimeString();
    do { fechaValidaActual = fechaValidaActual.replace("/",":"); } while(fechaValidaActual.includes("/"));

    //---------------
    let referenciaPathStorage = ref(storage, `images/anonimos/${clienteAnonimoEstructuradoRecibido.nombre + "/" + fechaValidaActual + "-" + horaValidaActual} `);
    //---------------

    console.log(filePhotoRecibido);

    await uploadBytes(referenciaPathStorage, filePhotoRecibido).then(async (snapshot)=>
    {
      await getDownloadURL(referenciaPathStorage).then(async (url)=>
      { 
        clienteAnonimoEstructuradoRecibido.foto = url;
      });
    }).catch( () => { console.log("Error");})
    
    console.log(clienteAnonimoEstructuradoRecibido);
    
    let newDocument = doc(db, "anonimos", newID.toString());
    await setDoc(newDocument, clienteAnonimoEstructuradoRecibido);
  }

  private async getLastIDClientesNormales()
  {
    let querySnapshot = getDocs(clientes);
    let flagMax = 0;

    (await ((querySnapshot))).docs.forEach((doc) => 
    {
      if (parseInt(doc.id) > flagMax)
      {
        flagMax = parseInt(doc.id);
      }
    });

    console.log(flagMax);
    return flagMax;
  }

  private async getLastIDClientesAnonimos()
  {
    let querySnapshot = getDocs(anonimos);
    let flagMax = 0;

    (await ((querySnapshot))).docs.forEach((doc) => 
    {
      if (parseInt(doc.id) > flagMax)
      {
        flagMax = parseInt(doc.id);
      }
    });

    console.log(flagMax);
    return flagMax;
  }

  private async leerClientesDB()
  {
    let arrayClientes = new Array();

    const querySnapshot = await getDocs(clientes);
    querySnapshot.forEach((doc) => 
    {
      let user = 
      {
        correo: doc.data()['correo'],
        password: doc.data()['password'],
        nombre: doc.data()['nombre'],
        apellido: doc.data()['apellido'],
        dni: doc.data()['dni'],
        tipo: 'cliente',
        estado: doc.data()['estado'],
        foto: doc.data()['foto'],
      }

      arrayClientes.push(user);
    });

    console.log(arrayClientes);
    return arrayClientes;
  }

  private async leerAnonimosDB()
  {
    let arrayAnonimos = new Array();

    const querySnapshot = await getDocs(anonimos);
    querySnapshot.forEach((doc) => 
    {
      let user = 
      {
        nombre: doc.data()['nombre'],
        foto: doc.data()['foto'],
      }

      arrayAnonimos.push(user);
    });

    console.log(arrayAnonimos);
    return arrayAnonimos;
  }
  //#endregion -------------------------------------------------------------

  //#region ---------------------- EMPLEADOS ---------------------------//
  public async subirEmpleadoDB(mailRecibido:string, passwordRecibida:string, nombreRecibido:string, apellidoRecibido:string, dniRecibido:number, tipoRecibido:string,cuilRecibido:string, fotoRecibida:any) 
  {
    
    //Estructuro el empleado
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

    this.subirFotoEmpleado(empleadoEstructurado.foto, empleadoEstructurado);
  }

  private async subirFotoEmpleado(filePhotoRecibido:any, empleadoEstructuradoRecibido:any)
  {
    //Leo db y me fijo la ultima ID. 
    let lastId = this.getLastIDEmpleados();
    let newID = await lastId + 1;

    //SUBO LA FOTO DE LA ENTIDAD AL STORAGE Y OBTENGO EL LINK PUBLICO. DESP, LO SUBO A LA DB Y CON LA NUEVA ID.
    let fechaValidaActual = new Date().toLocaleDateString();
    let horaValidaActual = new Date().toLocaleTimeString();
    do { fechaValidaActual = fechaValidaActual.replace("/",":"); } while(fechaValidaActual.includes("/"));

    //---------------
    let referenciaPathStorage = ref(storage, `images/empleados/${empleadoEstructuradoRecibido.tipo + "/" + empleadoEstructuradoRecibido.correo + "/" + empleadoEstructuradoRecibido.dni + "-" + fechaValidaActual + "-" + horaValidaActual} `);
    //---------------

    console.log(filePhotoRecibido);

    //Si la foto subida no es undefined, hago todo normal. Si no, le seteo la "foto default" de mi Storage.
    if (filePhotoRecibido != undefined)
    {
      await uploadBytes(referenciaPathStorage, filePhotoRecibido).then(async (snapshot)=>
      {
        await getDownloadURL(referenciaPathStorage).then(async (url)=>
        { 
          empleadoEstructuradoRecibido.foto = url;
        });
      }).catch( () => { console.log("Error");})
    }
    else
    {
      //Este es el link publico de la foto. "DownloadURL".
      empleadoEstructuradoRecibido.foto = "https://firebasestorage.googleapis.com/v0/b/parcial-2-pp.appspot.com/o/default-images%2Fempleado-default.png?alt=media&token=81ceffbb-68ab-41a9-92cf-893545306b1d"
    }
  
    console.log(empleadoEstructuradoRecibido);
    
    let newDocument = doc(db, "empleados", newID.toString());
    await setDoc(newDocument, empleadoEstructuradoRecibido);
  }

  public validarEmpleadoDB(mailRecibido:string, passwordRecibida:string, passwordConfirmRecibida:string ,nombreRecibido:string, apellidoRecibido:string, dniRecibido:number, tipoRecibido:string, cuilRecibido:string ,fotoRecibida:any)
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

  private async leerEmpleadosDB()
  {
    let arrayEmpleados = new Array();

    const querySnapshot = await getDocs(empleados);
    querySnapshot.forEach((doc) => 
    {
      let user = 
      {
        correo: doc.data()['correo'],
        password: doc.data()['password'],
        nombre: doc.data()['nombre'],
        apellido: doc.data()['apellido'],
        dni: doc.data()['dni'],
        cuil: doc.data()['cuil'],
        tipo: doc.data()['tipo'],
        foto: doc.data()['foto'],
      }

      arrayEmpleados.push(user);
    });

    console.log(arrayEmpleados);
    return arrayEmpleados;
  }

  private async getLastIDEmpleados()
  {
    let querySnapshot = getDocs(empleados);
    let flagMax = 0;

    (await ((querySnapshot))).docs.forEach((doc) => 
    {
      if (parseInt(doc.id) > flagMax)
      {
        flagMax = parseInt(doc.id);
      }
    });

    console.log(flagMax);
    return flagMax;
  }
  //#endregion -------------------------------------------------------------

  //#region ---------------------- AUTORIDADES ---------------------------//

  public async subirAutoridadDB(mailRecibido:string, passwordRecibida:string, nombreRecibido:string, apellidoRecibido:string, dniRecibido:number, cuilRecibido:string, fotoRecibida:any) 
  {
    
    //Estructuro la autoridad
    let autoriadEstructurada = 
    {
      correo: mailRecibido,
      password: passwordRecibida,
      nombre: nombreRecibido,
      apellido: apellidoRecibido,
      dni: dniRecibido,
      cuil: cuilRecibido,
      foto: fotoRecibida,
      tipo: 'supervisor'
    }

    this.subirFotoAutoridad(autoriadEstructurada.foto, autoriadEstructurada);
  }

  private async subirFotoAutoridad(filePhotoRecibido:any, autoridadEstructuradaRecibida:any)
  {
    //Leo db y me fijo la ultima ID. 
    let lastId = this.getLastIDAutoridades();
    let newID = await lastId + 1;

    //SUBO LA FOTO DE LA ENTIDAD AL STORAGE Y OBTENGO EL LINK PUBLICO. DESP, LO SUBO A LA DB Y CON LA NUEVA ID.
    let fechaValidaActual = new Date().toLocaleDateString();
    let horaValidaActual = new Date().toLocaleTimeString();
    do { fechaValidaActual = fechaValidaActual.replace("/",":"); } while(fechaValidaActual.includes("/"));

    //---------------
    let referenciaPathStorage = ref(storage, `images/autoridades/${autoridadEstructuradaRecibida.correo + "/" + autoridadEstructuradaRecibida.dni + "-" + fechaValidaActual + "-" + horaValidaActual} `);
    //---------------

    console.log(filePhotoRecibido);

    await uploadBytes(referenciaPathStorage, filePhotoRecibido).then(async (snapshot)=>
    {
      await getDownloadURL(referenciaPathStorage).then(async (url)=>
      { 
        autoridadEstructuradaRecibida.foto = url;
      });
    }).catch( () => { console.log("Error");})
    
    console.log(autoridadEstructuradaRecibida);
    
    let newDocument = doc(db, "autoridades", newID.toString());
    await setDoc(newDocument, autoridadEstructuradaRecibida);
  }

  private async leerAutoridadesDB()
  {
    let arrayAutoridades = new Array();

    const querySnapshot = await getDocs(autoridades);
    querySnapshot.forEach((doc) => 
    {
      let user = 
      {
        correo: doc.data()['correo'],
        password: doc.data()['password'],
        nombre: doc.data()['nombre'],
        apellido: doc.data()['apellido'],
        dni: doc.data()['dni'],
        cuil: doc.data()['cuil'],
        tipo: doc.data()['tipo'],
        foto: doc.data()['foto'],
      }

      arrayAutoridades.push(user);
    });

    console.log(arrayAutoridades);
    return arrayAutoridades;
  }

  private async getLastIDAutoridades()
  {
    let querySnapshot = getDocs(autoridades);
    let flagMax = 0;

    (await ((querySnapshot))).docs.forEach((doc) => 
    {
      if (parseInt(doc.id) > flagMax)
      {
        flagMax = parseInt(doc.id);
      }
    });

    console.log(flagMax);
    return flagMax;
  }

  //Valida datos de un cliente - Retorna el dato incorrecto
  public validarAutoridadDB(mailRecibido:string, passwordRecibida:string, passwordConfirmRecibida:string ,nombreRecibido:string, apellidoRecibido:string, dniRecibido:number, cuilRecibido:string ,fotoRecibida:any)
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
  //#endregion -------------------------------------------------------------
  
  //#region ---------------------- MESAS ---------------------------//

  public async getLastIDMesas()
  {
    let querySnapshot = getDocs(mesas);
    let flagMax = 0;

    (await ((querySnapshot))).docs.forEach((doc) => 
    {
      if (parseInt(doc.id) > flagMax)
      {
        flagMax = parseInt(doc.id);
      }
    });

    console.log(flagMax);
    return flagMax;
  }

  //#endregion -------------------------------------------------------------

  // Metodos generales
  public async buscarUsuarioPorMail(mailRecibido:string)
  {
    let usuarioEncontrado:any;

    //Leo todas las DB
    let arrayClientes = await this.leerClientesDB();
    let arrayEmpleados = await this.leerEmpleadosDB();
    let arrayAutoridades = await this.leerAutoridadesDB();

    //Como esto no esto no es tan optimo, no voy a seguir leyendo mas tablas 
    //si ya encontre un usuario...

    if (usuarioEncontrado == undefined)
    {
      (await arrayClientes).forEach((cliente) => 
      {
        if (cliente["correo"] != undefined && cliente["correo"].toLowerCase()  == mailRecibido.toLowerCase())
        {
          usuarioEncontrado = cliente;
        }
      });
    }

    if (usuarioEncontrado == undefined)
    {
      (await arrayEmpleados).forEach((empleado) => 
      {
        if (empleado["correo"] != undefined && empleado["correo"].toLowerCase()  == mailRecibido.toLowerCase())
        {
          usuarioEncontrado = empleado;
        }
      });
    }

    if (usuarioEncontrado == undefined)
    {
      (await arrayAutoridades).forEach((autoridad) => 
      {
        if (autoridad["correo"] != undefined && autoridad["correo"].toLowerCase()  == mailRecibido.toLowerCase())
        {
          usuarioEncontrado = autoridad;
        }
      });
    }
  
    return usuarioEncontrado;
  }
}
