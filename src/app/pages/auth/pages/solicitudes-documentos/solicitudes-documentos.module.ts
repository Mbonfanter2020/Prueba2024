import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SolicitudesDocumentosRoutingModule } from './solicitudes-documentos-routing.module';
import { SolicitudesDocumentosComponent } from './solicitudes-documentos.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { FilesUploadModule, SpinnerModule, TablaDinamicaModule } from '@app/shared';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    SolicitudesDocumentosRoutingModule,

  ]
})
export class SolicitudesDocumentosModule { }
