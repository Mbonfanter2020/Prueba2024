import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaSolicitudesComponent } from './lista-solicitudes.component';

const routes: Routes = [
  {
    path: '',
    component: ListaSolicitudesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListaSolicitudesRoutingModule { }
