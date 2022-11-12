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

    let horaActual = fecha.toLocaleTimeString();
    let horaSpliteada = horaActual.split(":");
    let horaAct = horaSpliteada[0];
    console.log(horaAct);

    resultado = value.filter( (element)=> 
    {

      console.log();

      //Filtro mensajes SOLO de HOY Y DE ESTE ULTIMO MINUTO
      if (element.fecha == fechaActual && parseInt(element.hora.split(":")[0]) == parseInt(horaAct))
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
      let splitA = a.hora.split(":");
      let splitB = b.hora.split(":");
      console.log(splitA);
      console.log(splitB);
      console.log("");

      if (parseInt(splitA[0]) < parseInt(splitB[0]))
      {
        return -1;
      }
      else if (parseInt(splitA[0]) == parseInt(splitB[0]))
      {
        if (parseInt(splitA[1]) < parseInt(splitB[1]))
        {
          return -1;
        }
        else
        {
          if (parseInt(splitA[1]) == parseInt(splitB[1]))
          {
              if (parseInt(splitA[2]) < parseInt(splitB[2]))
              {
                return -1;
              }
              else
              {
                return 0;
              }
          }
        } 
      }

      // if (a.hora > b.hora)
      // {
      //   return -1;
      // }
      // else
      // {
      //   return 0;
      // }
    });

    return resultado;
  }

}
