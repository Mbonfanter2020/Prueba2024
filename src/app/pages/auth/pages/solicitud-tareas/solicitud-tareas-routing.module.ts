import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SolicitudTareasComponent } from './solicitud-tareas.component';

const routes: Routes = [
  {
    path: '',
    component: SolicitudTareasComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitudTareasRoutingModule { }
