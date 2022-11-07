import { Injectable } from '@angular/core';
import { collection, doc, Firestore, getDocs, getFirestore, setDoc, updateDoc } from 'firebase/firestore/lite';
import { getDownloadURL, ref, uploadBytes, uploadString, getStorage } from '@firebase/storage'
import { clientesNormales, db, storage } from '../app.component';

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
    let referenciaPathStorage = ref(storage, `images/${clienteNormalEstructuradoRecibido.correo + "/" + clienteNormalEstructuradoRecibido.dni + "-" + fechaValidaActual + "-" + horaValidaActual} `);
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
    
    let newDocument = doc(db, "clientes-normales", newID.toString());
    await setDoc(newDocument, clienteNormalEstructuradoRecibido);
  }

  private async getLastIDClientesNormales()
  {
    let querySnapshot = getDocs(clientesNormales);
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
}
