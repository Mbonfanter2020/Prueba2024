import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth-guard';


const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m=>m.LoginModule)
  },
  {
    path: 'registration',
    loadChildren: () => import('./pages/registration/registration.module').then(m=>m.RegistrationModule)
  },
  {
    path: 'lista-solicitudes',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/lista-solicitudes/lista-solicitudes.module').then(m=>m.ListaSolicitudesModule)
  },
  {
    path: 'lista-solicitudes-admin',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/lista-solicitudes-admin/lista-solicitudes-admin.module').then(m=>m.ListaSolicitudesAdminModule)
  },
  {
    path: 'solicitudes-documentos',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/solicitudes-documentos/solicitudes-documentos.module').then(m=>m.SolicitudesDocumentosModule)
  },
  {
    path: 'solicitudes-efectos',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/solicitudes-efectos/solicitudes-efectos.module').then(m=>m.SolicitudesEfectosModule)
  },
  {
    path: 'solicitudes-causas',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/solicitudes-causas/solicitudes-causas.module').then(m=>m.SolicitudesCausasModule)
  },
  {
    path: 'permisos',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/permisos/permisos.module').then(m=>m.PermisosModule)
  },
  {
    path: 'perfil',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/perfil/perfil.module').then(m=>m.PerfilModule)
  },
  {
    path: 'universidad',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/lista-universidad-admin/lista-universidad-admin.module').then(m=>m.ListaUniversidadAdminModule)
  },
  {
    path: 'sedes',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/lista-sedes/lista-sedes.module').then(m=>m.ListaSedesModule)
  },
  {
    path: 'facultad',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/lista-facultad/lista-facultad.module').then(m=>m.ListaFacultadModule)
  },
  {
    path: 'escuela',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/lista-escuela/lista-escuela.module').then(m=>m.ListaEscuelaModule)
  },
  {
    path: 'tipo-producto',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/solicitud-tipo-producto/solicitud-tipo-producto.module').then(m=>m.SolicitudTipoProductoModule)
  },
  {
    path: 'tipos-productos',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/lista-tipo-producto/lista-tipo-producto.module').then(m=>m.ListaTipoProductoModule)
  },
  {
    path: 'programa',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/lista-programas/lista-programas.module').then(m=>m.ListaProgramasModule)
  },
  {
    path: 'productos',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/lista-producto/lista-producto.module').then(m=>m.ListaProductoModule)
  },
  {
    path: 'estudiantes',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/solicitud-tareas/solicitud-tareas.module').then(m=>m.SolicitudTareasModule)
  },

  {
    path:'**',
    pathMatch: 'full',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
