import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SolicitudUniversidadComponent } from './solicitud-universidad.component';

const routes: Routes = [
  {
    path: '',
    component: SolicitudUniversidadComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitudUniversidadRoutingModule { }
