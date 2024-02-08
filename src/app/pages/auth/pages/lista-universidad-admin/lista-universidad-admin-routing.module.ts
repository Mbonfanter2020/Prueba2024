import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaUniversidadAdminComponent } from './lista-universidad-admin.component';

const routes: Routes = [
  {
    path: '',
    component: ListaUniversidadAdminComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListaUniversidadAdminRoutingModule { }
