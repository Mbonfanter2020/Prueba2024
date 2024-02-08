import { DatePipe, NgFor } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_FORMATS, MatDateFormats, MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Metodologia } from '@app/models/backend/data-universidad/proyecto/metodologia';
import { MetodologiaService } from '@app/services/data-universidad/universidad/metodologia.service';
import { UserStateService } from '@app/services/login/user-state.service';
import { Observable, map } from 'rxjs';

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
  selector: 'app-get-metodologia-universidad',
  templateUrl: './get-metodologia-universidad.component.html',
  styleUrls: ['./get-metodologia-universidad.component.scss'],
  providers : [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },DatePipe
  ],
  standalone: true,
  imports: [
    MatGridListModule,MatFormFieldModule
    ,MatDialogModule,MatButtonModule,ReactiveFormsModule
    ,MatInputModule,FormsModule
    ,NgFor,MatOptionModule,MatSelectModule
  ],
})
export class GetMetodologiaUniversidadComponent {
  idUser: Number = 0;
  tituloAccion: string = 'Metodología - Universidad';
  botonAccion: string = 'Guardar';
  frmGetUniModalidad: FormGroup;
  constructor(
    private dialogoRefencia: MatDialogRef<GetMetodologiaUniversidadComponent>,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public datos: Metodologia,
    private _servicieMetodologiaUni: MetodologiaService,
    private datePipe: DatePipe,
    private userStateService: UserStateService
  ) {

    this.IdUser().subscribe(id => {
      this.idUser = id;
    });

    this.frmGetUniModalidad = this.fb.group({
      nombre: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if(this.datos ){
      this.frmGetUniModalidad.patchValue({
          nombre:this.datos.nombre,
      })
      this.botonAccion = "Actualizar";
      this.tituloAccion = "Actualizar Metodología - Universidad";

    }

  }

  IdUser(): Observable<Number> {
    return this.userStateService.userState$.pipe(
      map(userState => {
        if(userState.id == null){
          return 0;
        }
        return userState.id;
      })
    );
  }


  MostrarAlertar(message: string, action: string) {
    this._snackBar.open(message, action, {
      horizontalPosition:"end",
      verticalPosition:"top",
      duration:4000
    });
  }

  GuardarEditar(){
    const fechaFormateada = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    const modelo: Metodologia = {
      id:0,
      nombre:this.frmGetUniModalidad.value.nombre,
      fechaServidor:fechaFormateada,
      usuario:this.idUser
    }

    if(!this.datos ){
      this._servicieMetodologiaUni.add(modelo).subscribe({
        next: (data) => {
          this.MostrarAlertar("Solicitud registrada con éxito","Listo");
          this.dialogoRefencia.close("Creado");
        },error: (e) => {
          this.MostrarAlertar("No se pudo registrar la solicitud","Error");
        }
      })


    }else{

      this._servicieMetodologiaUni.update(this.datos.id,modelo).subscribe({
        next: (data) => {
          this.MostrarAlertar("Sede modificada con éxito","Listo");
          this.dialogoRefencia.close("Editado");
        },error: (e) => {
          this.MostrarAlertar("No se pudo registrar la sede","Error");
        }
      })
    }
  }
}
