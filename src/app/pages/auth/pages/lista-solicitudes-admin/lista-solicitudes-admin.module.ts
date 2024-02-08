import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListaSolicitudesAdminRoutingModule } from './lista-solicitudes-admin-routing.module';
import { ListaSolicitudesAdminComponent } from './lista-solicitudes-admin.component';

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    ListaSolicitudesAdminRoutingModule,
    ListaSolicitudesAdminComponent

  ],
})
export class ListaSolicitudesAdminModule { }
