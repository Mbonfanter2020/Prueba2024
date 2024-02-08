import { DatePipe, NgClass, NgFor } from '@angular/common';
import { Component,OnInit,Inject, inject, } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DATE_FORMATS, MatDateFormats, MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Universidad } from '@app/models/backend/data-universidad/universidad/universidad';
import { TipoIdentificacion } from '@app/models/backend/datos-principales/tipo-identificacion';
import { UniversidadService } from '@app/services/data-universidad/universidad/universidad.service';
import { TipoIdentificacionService } from '@app/services/datos-principales/tipo-identificacion.service';
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
  selector: 'app-universidades',
  templateUrl: './universidades.component.html',
  styleUrls: ['./universidades.component.scss'],
  providers : [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },DatePipe
  ],
  standalone: true,
  imports: [MatGridListModule,MatFormFieldModule
    ,MatDialogModule,MatButtonModule,ReactiveFormsModule
    ,MatInputModule,MatSelectModule,MatOptionModule,FormsModule
    ,NgFor,NgClass,MatIconModule,MatTooltipModule,FlexLayoutModule,MatChipsModule
    ],
})
export class UniversidadesComponent implements OnInit {
  frmGetUniversidad: FormGroup;
  fechaIngreso: string;
  Modo: string = "N";
  botonAccion: string = "Guardar";
  tituloAccion: string = "Nueva Solicitud";
  listaTipoDocumento: TipoIdentificacion[];
  idUser : Number = 0;

  constructor(private dialogoRefencia: MatDialogRef<UniversidadesComponent>
    ,private fb: FormBuilder
    ,private _snackBar: MatSnackBar
    ,private datePipe: DatePipe
    ,private serviceTipoDocumento: TipoIdentificacionService
    ,@Inject(MAT_DIALOG_DATA) public datosUniversidad: Universidad
    ,private userStateService: UserStateService
    ,private _universidadService: UniversidadService
    )
  {
    this.IdUser().subscribe(id => {
      this.idUser = id;
    });

    this.serviceTipoDocumento.get().subscribe({
      next: (data) => {
        this.listaTipoDocumento = data;
      },error: (e) => {}
    })

    const fechaActual = new Date();
    this.fechaIngreso = fechaActual.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });

    this.frmGetUniversidad = this.fb.group({
        fechaIngreso:[this.fechaIngreso,Validators.required],
        tipoDoc:['',Validators.required],
        identificacion:['',Validators.required],
        alias:['',Validators.nullValidator],
        nombre:['',Validators.nullValidator],
    })
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


  ngOnInit(): void {

    if(this.datosUniversidad ){
      this.frmGetUniversidad.patchValue({
        fechaIngreso:this.datosUniversidad.fechaServidor ,
        tipoDoc:this.datosUniversidad.tipoIdentificacion,
        identificacion:this.datosUniversidad.identificacion,
        alias:this.datosUniversidad.alias,
        nombre:this.datosUniversidad.nombre,
      })

      this.botonAccion = "Actualizar";
      this.tituloAccion = "Actualizar Universidad";
      this.Modo = "E";
    }
  }

  RegistrarUniversiad(){
    const fechaFormateada = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    const modelo: Universidad = {
      id:0,
      TipoIdentificacion:'',
      alias:this.frmGetUniversidad.value.alias,
      nombre:this.frmGetUniversidad.value.nombre,
      identificacion:this.frmGetUniversidad.value.identificacion,
      fechaServidor:fechaFormateada,
      estacion:window.location.hostname,
      tipoIdentificacion:this.frmGetUniversidad.value.tipoDoc,
      usuario:this.idUser
    }


    if(this.datosUniversidad == null){
      console.log(modelo)
      this._universidadService.add(modelo).subscribe({
        next: (data) => {
          this.MostrarAlertar("Universidad registrada con éxito","Listo");
            this.dialogoRefencia.close("Creado");

        },error: (e) => {
          this.MostrarAlertar("No se pudo registrar la universidad","Error");
        }
      })


    }else{
      this._universidadService.update(this.datosUniversidad.id,modelo).subscribe({
        next: (data) => {
          this.MostrarAlertar("Universidad editada con éxito","Listo");
          this.dialogoRefencia.close("Editado");
        },error: (e) => {
          this.MostrarAlertar("No se pudo editar la universidad","Error");
        }})
      }
  }


  MostrarAlertar(message: string, action: string) {
    this._snackBar.open(message, action, {
      horizontalPosition:"end",
      verticalPosition:"top",
      duration:4000
    });
  }

}
