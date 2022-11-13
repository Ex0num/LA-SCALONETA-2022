import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtradorPedidosEnPreparacionCocina'
})
export class FiltradorPedidosEnPreparacionCocinaPipe implements PipeTransform {

  transform(value: any[]): any[]  
  {
    let resultado;

    resultado = value.filter( (element)=> 
    {
      if (element.estado == 'en_preparacion' && element.carrito_cocina.length > 0 && element.estado_cocina_finalizado == false)
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


