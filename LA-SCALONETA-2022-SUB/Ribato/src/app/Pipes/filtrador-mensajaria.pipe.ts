import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtradorMensajaria'
})
export class FiltradorMensajariaPipe implements PipeTransform {

  transform(value: any[]): any[]  
  {
    let resultado;

    let fecha = new Date();
    let fechaActual = fecha.toLocaleDateString();

    resultado = value.filter( (element)=> 
    {

      //Filtro mensajes SOLO de HOY
      if (element.fecha == fechaActual)
      {
        return -1;
      }
      else
      {
        return 0;
      }
    });

    resultado.sort( (a,b) => 
    {
      if (a.hora > b.hora)
      {
        return 0;
      }
      else
      {
        return -1;
      }
    });

    return resultado;
  }

}
