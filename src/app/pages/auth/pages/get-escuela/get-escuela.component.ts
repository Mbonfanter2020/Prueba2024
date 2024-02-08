
import { Escuela } from '@app/models/backend/data-universidad/universidad/escuela';
import { DatePipe, NgFor } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DATE_FORMATS,
  MatDateFormats,
  MatOptionModule,
} from '@angular/material/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Facultad } from '@app/models/backend/data-universidad/universidad/facultad';
import { FacultadService } from '@app/services/data-universidad/universidad/facultad.service';
import { SedeService } from '@app/services/data-universidad/universidad/sede.service';
import { UserStateService } from '@app/services/login/user-state.service';
import { UsuarioUniversidadService } from '@app/services/user/usuario-universidad.service';
import { Observable, map } from 'rxjs';
import { EscuelaService } from '@app/services/data-universidad/universidad/escuela.service';

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
  selector: 'app-get-escuela',
  templateUrl: './get-escuela.component.html',
  styleUrls: ['./get-escuela.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    DatePipe,
  ],
  standalone: true,
  imports: [
    MatGridListModule,
    MatFormFieldModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    FormsModule,
    NgFor,
    MatOptionModule,
    MatSelectModule,
  ],
})
export class GetEscuelaComponent {
  frmGetFacultad: FormGroup;
  ListaFacultad: Facultad[] = [];
  idUser: Number = 0;
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  idUniversidad: Number = 0;
  tituloAccion: string = 'Nueva Escuela';
  botonAccion: string = 'Guardar';

  constructor(
    private dialogoRefencia: MatDialogRef<GetEscuelaComponent>,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public datos: Escuela,
    private _serviceFacultades: FacultadService,
    private _serviceUserUni: UsuarioUniversidadService,
    private _esceulaService: EscuelaService,
    private userStateService: UserStateService,
    private datePipe: DatePipe
  ) {
    this.IdUser().subscribe((id) => {
      this.idUser = id;
      this.IsAdmin().subscribe((is) => {
        this.isAdmin = is;
      });
      this.cargarFacultades();
    });

    this.frmGetFacultad = this.fb.group({
      codigo: [this.datos.codigoEscuela, Validators.required],
      CodFacultad: ['', Validators.required],
      nombre: ['', Validators.required],
    });
  }

  IdUser(): Observable<Number> {
    return this.userStateService.userState$.pipe(
      map((userState) => {
        if (userState.id == null) {
          return 0;
        }
        return userState.id;
      })
    );
  }

  IsAdmin(): Observable<boolean> {
    return this.userStateService.userState$.pipe(
      map((userState) => {
        this.isSuperAdmin = userState.isSuperAdmin;
        if (userState.isAdmin == false) {
          return false;
        }
        return true;
      })
    );
  }

  cargarFacultades() {
    if (this.isSuperAdmin) {
      this._serviceFacultades.get().subscribe({
        next: (data) => {
          this.ListaFacultad = data;
        },
        error: (e) => {},
      });
    } else {
      this._serviceUserUni.getByUsuario(this.idUser).subscribe({
        next: (data) => {
          if (data.length > 0) {
            this.idUniversidad = data.at(0).idUniversidad;
            this._serviceFacultades.getByUniversidad(this.idUniversidad).subscribe({
              next: (data2) => {
                this.ListaFacultad = data2;
              },
              error: (e) => {},
            });
          }
        },
        error: (e) => {},
      });
    }
  }

  ngOnInit(): void {
    if (this.datos && this.datos.nombre != '') {
      this.frmGetFacultad.patchValue({
        id: this.datos.id,
        codigo: this.datos.codigoEscuela,
        CodFacultad: this.datos.codigoFacultad,
        nombre: this.datos.nombre,
      });
      this.botonAccion = 'Actualizar';
      this.tituloAccion = 'Actualizar Facultad';
    }
  }

  MostrarAlertar(message: string, action: string) {
    this._snackBar.open(message, action, {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 4000,
    });
  }

  Guardar() {
    const fechaFormateada = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    const modelo: Escuela = {
      id: 0,
      nombreFacultad: '',
      codigoEscuela: this.frmGetFacultad.value.codigo,
      nombre: this.frmGetFacultad.value.nombre,
      fechaServidor: fechaFormateada,
      estacion: window.location.hostname,
      codigoUniversidad: this.idUniversidad,
      codigoFacultad: this.frmGetFacultad.value.CodFacultad,
      usuario: this.idUser,
    };

    if (this.datos.nombre == '') {
      this._esceulaService.add(modelo).subscribe({
        next: (data) => {
          this.MostrarAlertar('Facultad registrada con éxito', 'Listo');
          this.dialogoRefencia.close('Creado');
        },
        error: (e) => {
          this.MostrarAlertar('No se pudo registrar la facultad', 'Error');
        },
      });
    } else {
      this._esceulaService.update(this.datos.id, modelo).subscribe({
        next: (data) => {
          this.MostrarAlertar('Facultad modificada con éxito', 'Listo');
          this.dialogoRefencia.close('Editado');
        },
        error: (e) => {
          this.MostrarAlertar('No se pudo actualizar la facultad', 'Error');
        },
      });
    }
  }
}
