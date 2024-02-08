import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaParticipantesComponent } from './lista-participantes.component';

const routes: Routes = [
  {
    path: '',
    component: ListaParticipantesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListaParticipantesRoutingModule { }
