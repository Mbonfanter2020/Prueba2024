import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaProductoComponent } from './lista-producto.component';

const routes: Routes = [
  {
    path: '',
    component: ListaProductoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListaProductoRoutingModule { }
