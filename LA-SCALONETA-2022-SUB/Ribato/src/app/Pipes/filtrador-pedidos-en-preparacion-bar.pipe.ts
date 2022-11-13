import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtradorPedidosEnPreparacionBar'
})
export class FiltradorPedidosEnPreparacionBarPipe implements PipeTransform{

  transform(value: any[]): any[]  
  {
    let resultado;

    resultado = value.filter( (element)=> 
    {
      if (element.estado == 'en_preparacion' && element.carrito_bar.length > 0 && element.estado_bar_finalizado == false)
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

