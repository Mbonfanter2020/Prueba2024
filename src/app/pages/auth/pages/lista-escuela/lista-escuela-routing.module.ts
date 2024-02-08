import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaEscuelaComponent } from './lista-escuela.component';

const routes: Routes = [
  {
    path: '',
    component: ListaEscuelaComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListaEscuelaRoutingModule { }
