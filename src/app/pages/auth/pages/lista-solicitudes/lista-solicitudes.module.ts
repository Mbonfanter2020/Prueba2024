import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListaSolicitudesRoutingModule } from './lista-solicitudes-routing.module';
import { ListaSolicitudesComponent } from './lista-solicitudes.component';

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    ListaSolicitudesRoutingModule,
    ListaSolicitudesComponent

  ],
})
export class ListaSolicitudesModule { }
