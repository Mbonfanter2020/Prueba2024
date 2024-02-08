import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablaDinamicaModule } from './tabla-dinamica/tabla-dinamica.module';




@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    TablaDinamicaModule
  ],
  exports:[
    TablaDinamicaModule
  ]
})
export class ControlsModule { }
