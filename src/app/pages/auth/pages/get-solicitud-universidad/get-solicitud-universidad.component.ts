import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { DatePipe, NgFor } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SolicitudParticipanteService } from '@app/services/solicitudes/solicitud-participante.service';
import { SolicitudParticipante } from '@app/models/backend/solicitudes/solicitud-participantes';
import { MAT_DATE_FORMATS, MatDateFormats, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { Tercero } from '@app/models/backend/user/tercero';
import { TerceroService } from '@app/services/user/tercero.service';
import { UniversidadService } from '@app/services/data-universidad/universidad/universidad.service';
import { Universidad } from '@app/models/backend/data-universidad/universidad/universidad';
import { TerceroUniversidad } from '@app/models/backend/user/tercero-universidad';
import { TerceroUniversidadService } from '@app/services/user/tercero-universidad.service';

const MY_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'YYYY-MM-DD', // Formato de fecha de entrada (opcional)
  },
  display: {
    dateInput: 'DD/MM/YYYY', // Formato de fecha de salida
    monthYearLabel: 'MMM YYYY', // Formato para etiquetas de mes y año
    dateA11yLabel: 'LL', // Formato accesible para la fecha
    monthYearA11yLabel: 'MMMM YYYY', // Formato accesible para etiquetas de mes y año
  },
};

@Component({
  selector: 'app-get-solicitud-universidad',
  templateUrl: './get-solicitud-universidad.component.html',
  styleUrls: ['./get-solicitud-universidad.component.scss'],
  providers : [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },DatePipe
  ],
  standalone: true,
  imports: [MatGridListModule,MatFormFieldModule
    ,MatDialogModule,MatButtonModule,ReactiveFormsModule
    ,MatInputModule,FormsModule
    ,NgFor,MatOptionModule,MatSelectModule],
})
export class GetSolicitudUniversidadComponent implements OnInit{
  frmGetParticipante: FormGroup;
  Id:Number = 0;
  listaUniversidad: Universidad[] = [];
  fechaIngreso: string;

  constructor(private dialogoRefencia: MatDialogRef<GetSolicitudUniversidadComponent>
    ,private fb: FormBuilder
    ,private _snackBar: MatSnackBar
    ,@Inject(MAT_DIALOG_DATA) public datos: any
    ,private _universidadTerceroSer: TerceroUniversidadService
    ,private _universidadSer: UniversidadService
  ){
    this.Id = datos.id;


    const fechaActual = new Date();
    this.fechaIngreso = fechaActual.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });


    this.frmGetParticipante = this.fb.group({
      fechaIngreso:[this.fechaIngreso,Validators.required],
      codUniversidad:['',Validators.required]
    });

    this._universidadSer.get().subscribe({
      next: (data) => {
        this.listaUniversidad = data;
      },error: (e) => {}
    })
  }

  ngOnInit(): void {

  }


  MostrarAlertar(message: string, action: string) {
    this._snackBar.open(message, action, {
      horizontalPosition:"end",
      verticalPosition:"top",
      duration:4000
    });
  }

  Guardar(){

    const modelo : TerceroUniversidad = {
          id:0,
          idTercero:this.Id,
          idUniversidad: this.frmGetParticipante.value.codUniversidad,
        }

        this._universidadTerceroSer.add(modelo).subscribe({
          next: (data) => {
            this.MostrarAlertar("Solicitud realizada con éxito","Listo");
            this.dialogoRefencia.close("Creado");
          },error: (e) => {
            this.MostrarAlertar("No se pudo realizar la solicitud","Error");
          }
        })
  }

}
