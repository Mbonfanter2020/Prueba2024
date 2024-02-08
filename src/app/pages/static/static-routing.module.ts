import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth-guard';

const routes: Routes = [
  {
    path: 'welcome',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/welcome/welcome.module').then(m=> m.WelcomeModule)
  },
  {
    path: 'acerca-nosotros',
    loadChildren: () => import('./pages/acerca-nosotros/acerca-nosotros.module').then(m=>m.AcercaNosotrosModule)
  },
  {
    path: '404',
    loadChildren: () => import('./pages/not-found/not-found.module').then(m=> m.NotFoundModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaticRoutingModule { }
