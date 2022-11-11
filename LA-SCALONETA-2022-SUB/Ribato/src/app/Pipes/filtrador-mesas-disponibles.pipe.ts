import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtradorMesasDisponibles'
})
export class FiltradorMesasDisponiblesPipe implements PipeTransform {

  transform(value: any[]): any[]  
  {
    let resultado;

    resultado = value.filter( (element)=> 
    {
      if (element.estado == 'disponible')
      {
        return -1;
      }
      else
      {
        return 0;
      }
    });

    return resultado;
  }

}
