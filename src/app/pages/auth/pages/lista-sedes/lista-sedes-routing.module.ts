import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaSedesComponent } from './lista-sedes.component';

const routes: Routes = [
  {
    path: '',
    component: ListaSedesComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListaSedesRoutingModule { }
