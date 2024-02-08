import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { TablaDinamicaComponent } from './tabla-dinamica.component';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    TablaDinamicaComponent
  ],
  exports: [
    TablaDinamicaComponent
  ]
})
export class TablaDinamicaModule { }
