import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { NgFor } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SolicitudParticipanteService } from '@app/services/solicitudes/solicitud-participante.service';
import { SolicitudParticipante } from '@app/models/backend/solicitudes/solicitud-participantes';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { Tercero } from '@app/models/backend/user/tercero';
import { TerceroService } from '@app/services/user/tercero.service';

@Component({
  selector: 'app-get-participante-solicitud',
  templateUrl: './get-participante-solicitud.component.html',
  styleUrls: ['./get-participante-solicitud.component.scss'],
  standalone: true,
  imports: [MatGridListModule,MatFormFieldModule
    ,MatDialogModule,MatButtonModule,ReactiveFormsModule
    ,MatInputModule,FormsModule
    ,NgFor,MatOptionModule,MatSelectModule],
})
export class GetParticipanteSolicitudComponent implements OnInit{
  frmGetParticipante: FormGroup;
  Id:Number = 0;
  listaTercero: Tercero[] = [];


  constructor(private dialogoRefencia: MatDialogRef<GetParticipanteSolicitudComponent>
    ,private fb: FormBuilder
    ,private _snackBar: MatSnackBar
    ,@Inject(MAT_DIALOG_DATA) public datos: any
    ,private _participanteSer: SolicitudParticipanteService
    ,private _terceriosSer: TerceroService
  ){
    this.Id = datos.id;

    this.frmGetParticipante = this.fb.group({
      codTercero:['',Validators.required],
      expactativa:['',Validators.required]
    });

    this._terceriosSer.get().subscribe({
      next: (data) => {
        this.listaTercero = data;
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

    const modelo : SolicitudParticipante = {
          id:0,
          nombreTercero:'',
          TipoIdentificacion:'',
          identificacion:'',
          Expectativas:this.frmGetParticipante.value.expactativa,
          fechaIngreso:new Date,
          codTercero:this.frmGetParticipante.value.codTercero,
          idSolicitud:this.Id
        }

        this._participanteSer.add(modelo).subscribe({
          next: (data) => {
            this.MostrarAlertar("Participante adicionado con éxito","Listo");
            this.dialogoRefencia.close("Creado");
          },error: (e) => {
            this.MostrarAlertar("No se pudo adicionar lel participante","Error");
          }
        })
  }

}
