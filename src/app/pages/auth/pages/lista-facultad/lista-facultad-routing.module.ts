import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaFacultadComponent } from './lista-facultad.component';

const routes: Routes = [
  {
    path: '',
    component: ListaFacultadComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListaFacultadRoutingModule { }
