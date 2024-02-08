import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-acerca-nosotros',
  templateUrl: './acerca-nosotros.component.html',
  styleUrls: ['./acerca-nosotros.component.scss'],
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
})
export class AcercaNosotrosComponent {
  lema = 'Transformando Ideas en Soluciones: Empoderando la Educación a través de Research Ecosystem';
  parte1 = `Frente a las limitadas capacidades existentes para la gestión de la información generada en los procesos
          de investigación formativa de las Instituciones de Educación Superior, los cuales involucran la identificación
          de problemáticas del entorno para que pueda ser solucionados en el aula de clase, es imperativo contar con un
          sistema eficiente. Este sistema permitirá que dichos datos sean inicialmente proporcionados por partes interesadas
          y luego revisados por docentes, quienes podrán establecer la estrategia metodológica para abordarlo acorde
          a su nivel de complejidad. Posteriormente, estos problemas son asignados a estudiantes con el
          fin de fomentar soluciones creativas e innovadoras que su vez atiendan las demandas territoriales,
           de tal forma que se evidencie las competencias adquiridas en sus currículos establecidos para su área de desempeño.
         `;
 parte2 = `En este contexto, se propone la implementación Research Ecosystem, diseñado para respaldar datos estructurados
       derivados de estos procesos. Su objetivo es posibilitar el análisis en el momento requerido, cumpliendo con
        solicitudes internas de otros procesos directivos y facilitando la toma de decisiones. Este aplicativo
        se presenta como una herramienta fundamental para la gestión del conocimiento institucional,
        la trazabilidad y la protección de la propiedad intelectual asociada a estas actividades.
       `;
}
