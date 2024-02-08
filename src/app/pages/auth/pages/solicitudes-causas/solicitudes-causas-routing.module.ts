import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SolicitudesCausasComponent } from './solicitudes-causas.component';

const routes: Routes = [
  {
    path: '',
    component: SolicitudesCausasComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitudesCausasRoutingModule { }
