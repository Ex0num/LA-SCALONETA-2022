import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtradorPedidosEsperandoRespuesta'
})
export class FiltradorPedidosEsperandoRespuestaPipe implements PipeTransform {

  transform(value: any[], nombreMozoRecibido:string): any[]  
  {
    let resultado;

    resultado = value.filter( (element)=> 
    {
      if (element.mozo == nombreMozoRecibido && element.estado == 'preparado' || element.estado == 'pago_solicitado')
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
