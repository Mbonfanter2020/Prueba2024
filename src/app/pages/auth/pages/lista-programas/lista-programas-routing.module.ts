import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaProgramasComponent } from './lista-programas.component';

const routes: Routes = [
  {
    path: '',
    component: ListaProgramasComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListaProgramasRoutingModule { }
