import { Injectable } from '@angular/core';
import { collection, doc, Firestore, getDocs, getFirestore, setDoc, updateDoc } from 'firebase/firestore/lite';
import { getDownloadURL, ref, uploadBytes, uploadString, getStorage } from '@firebase/storage'
import { anonimos, autoridades, clientes, db, empleados, storage } from '../app.component';

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
  //#endregion -------------------------------------------------------------

  //#region ---------------------- AUTORIDADES ---------------------------//
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
        if (cliente["correo"].toLowerCase()  == mailRecibido.toLowerCase())
        {
          usuarioEncontrado = cliente;
        }
      });
    }

    if (usuarioEncontrado == undefined)
    {
      (await arrayEmpleados).forEach((empleado) => 
      {
        if (empleado["correo"].toLowerCase()  == mailRecibido.toLowerCase())
        {
          usuarioEncontrado = empleado;
        }
      });
    }

    if (usuarioEncontrado == undefined)
    {
      (await arrayAutoridades).forEach((autoridad) => 
      {
        if (autoridad["correo"].toLowerCase()  == mailRecibido.toLowerCase())
        {
          usuarioEncontrado = autoridad;
        }
      });
    }
  
    return usuarioEncontrado;
  }
}
