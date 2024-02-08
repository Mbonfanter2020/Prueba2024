import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaTipoProductoComponent } from './lista-tipo-producto.component';

const routes: Routes = [
  {
    path: '',
    component: ListaTipoProductoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListaTipoProductoRoutingModule { }
