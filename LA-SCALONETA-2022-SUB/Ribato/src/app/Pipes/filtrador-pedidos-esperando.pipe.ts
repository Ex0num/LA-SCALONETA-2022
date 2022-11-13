import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtradorPedidosEsperando'
})
export class FiltradorPedidosEsperandoPipe implements PipeTransform {

  transform(value: any[]): any[]  
  {
    let resultado;

    resultado = value.filter( (element)=> 
    {
      if (element.estado == 'esperando_aceptacion')
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
