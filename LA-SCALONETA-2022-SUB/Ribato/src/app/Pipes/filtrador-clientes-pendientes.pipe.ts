import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtradorClientesPendientes',
  pure: false,
})
export class FiltradorClientesPendientesPipe implements PipeTransform {

  transform(value: any[]): any[]  
  {
    let resultado;

    resultado = value.filter( (element)=> 
    {
      if (element.estado == 'pendiente')
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
