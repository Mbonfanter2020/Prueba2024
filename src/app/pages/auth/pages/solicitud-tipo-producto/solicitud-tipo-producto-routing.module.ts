import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SolicitudTipoProductoComponent } from './solicitud-tipo-producto.component';

const routes: Routes = [
  {
    path: '',
    component: SolicitudTipoProductoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitudTipoProductoRoutingModule { }
