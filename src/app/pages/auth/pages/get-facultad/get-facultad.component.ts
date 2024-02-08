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
import { Sede } from '@app/models/backend/data-universidad/universidad/sede';
import { Universidad } from '@app/models/backend/data-universidad/universidad/universidad';
import { FacultadService } from '@app/services/data-universidad/universidad/facultad.service';
import { SedeService } from '@app/services/data-universidad/universidad/sede.service';
import { UniversidadService } from '@app/services/data-universidad/universidad/universidad.service';
import { UserStateService } from '@app/services/login/user-state.service';
import { UsuarioUniversidadService } from '@app/services/user/usuario-universidad.service';
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
  selector: 'app-get-facultad',
  templateUrl: './get-facultad.component.html',
  styleUrls: ['./get-facultad.component.scss'],
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
export class GetFacultadComponent {
  frmGetFacultad: FormGroup;
  ListaSede: Sede[] = [];
  idUser: Number = 0;
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  idUniversidad: Number = 0;
  tituloAccion: string = 'Nueva Facultad';
  botonAccion: string = 'Guardar';

  constructor(
    private dialogoRefencia: MatDialogRef<GetFacultadComponent>,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public datos: Facultad,
    private _serviceSedes: SedeService,
    private _serviceUserUni: UsuarioUniversidadService,
    private _facultadService: FacultadService,
    private userStateService: UserStateService,
    private datePipe: DatePipe
  ) {
    this.IdUser().subscribe((id) => {
      this.idUser = id;
      this.IsAdmin().subscribe((is) => {
        this.isAdmin = is;
      });
      this.cargarSedes();
    });

    this.frmGetFacultad = this.fb.group({
      codigo: [this.datos.codigoFacultad, Validators.required],
      CodSede: ['', Validators.required],
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

  cargarSedes() {
    if (this.isSuperAdmin) {
      this._serviceSedes.get().subscribe({
        next: (data) => {
          this.ListaSede = data;
        },
        error: (e) => {},
      });
    } else {
      this._serviceUserUni.getByUsuario(this.idUser).subscribe({
        next: (data) => {
          if (data.length > 0) {
            this.idUniversidad = data.at(0).idUniversidad;
            this._serviceSedes.getByUniversidad(this.idUniversidad).subscribe({
              next: (data2) => {
                this.ListaSede = data2;
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
        codigo: this.datos.codigoFacultad,
        CodSede: this.datos.codigoUniversidad,
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
    const modelo: Facultad = {
      id: 0,
      nombreSede: '',
      codigoFacultad: this.frmGetFacultad.value.codigo,
      nombre: this.frmGetFacultad.value.nombre,
      fechaServidor: fechaFormateada,
      estacion: window.location.hostname,
      codigoUniversidad: this.idUniversidad,
      codigoSede: this.frmGetFacultad.value.CodSede,
      usuario: this.idUser,
    };

    if (this.datos.nombre == '') {
      this._facultadService.add(modelo).subscribe({
        next: (data) => {
          this.MostrarAlertar('Facultad registrada con éxito', 'Listo');
          this.dialogoRefencia.close('Creado');
        },
        error: (e) => {
          this.MostrarAlertar('No se pudo registrar la facultad', 'Error');
        },
      });
    } else {
      this._facultadService.update(this.datos.id, modelo).subscribe({
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
