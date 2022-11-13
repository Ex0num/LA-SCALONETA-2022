import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transformadorEstadoPedido'
})
export class TransformadorEstadoPedidoPipe implements PipeTransform {

  transform(estadoPedido: string): string  
  {
    let resultado;

    switch (estadoPedido) 
    {
      case 'esperando_aceptacion':
      {
        resultado = 'Esperando un mozo';
        break;
      }
      case 'en_preparacion':
      {
        resultado = 'Preparándose';
        break;
      }
      case 'preparado': 
      {
        resultado = 'Listo para entregar';
        break;
      }                                               //De preparado a entregado sin confirmar LO CLICKEA EL MOZO
      case 'entregado_sin_confirmar':
      {
        resultado = 'Entregado sin confirmación del cliente';
        break;
      }
      case 'pago_pendiente':
      {
        resultado = 'Pago pendiente';
        break;
      }
      case 'pago_solicitado':
      {
        resultado = 'Pago solicitado';
        break;
      }
      case 'pagado':                                  //De pago_solicitado a pagado LO CLICKEA EL MOZO
      {
        resultado = 'Pago realizado';
        break;
      }
    }
    
    return resultado;
  }

}
