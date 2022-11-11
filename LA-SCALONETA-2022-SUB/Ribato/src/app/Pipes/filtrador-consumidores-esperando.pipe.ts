import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtradorConsumidoresEsperando'
})
export class FiltradorConsumidoresEsperandoPipe implements PipeTransform {

  transform(value: any[]): any[]  
  {
    let resultado;

    resultado = value.filter( (element)=> 
    {
      if (element.estado == 'esperando_mesa')
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
