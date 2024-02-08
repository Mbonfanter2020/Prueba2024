import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcercaNosotrosComponent } from './acerca-nosotros.component';

const routes: Routes = [
  {
    path: '',
    component: AcercaNosotrosComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcercaNosotrosRoutingModule { }
