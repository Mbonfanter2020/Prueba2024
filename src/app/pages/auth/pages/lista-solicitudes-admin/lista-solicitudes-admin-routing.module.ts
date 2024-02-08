import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaSolicitudesAdminComponent } from './lista-solicitudes-admin.component';

const routes: Routes = [
  {
    path: '',
    component: ListaSolicitudesAdminComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListaSolicitudesAdminRoutingModule { }
