import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SolicitudesEfectosComponent } from './solicitudes-efectos.component';

const routes: Routes = [
  {
    path: '',
    component: SolicitudesEfectosComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitudesEfectosRoutingModule { }
