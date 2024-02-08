
import { Programa } from '@app/models/backend/data-universidad/universidad/programa';
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
import { FacultadService } from '@app/services/data-universidad/universidad/facultad.service';
import { UserStateService } from '@app/services/login/user-state.service';
import { UsuarioUniversidadService } from '@app/services/user/usuario-universidad.service';
import { Observable, map } from 'rxjs';
import { EscuelaService } from '@app/services/data-universidad/universidad/escuela.service';
import { ProgramaService } from '@app/services/data-universidad/universidad/programa.service';
import { Escuela } from '@app/models/backend/data-universidad/universidad/escuela';

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
  selector: 'app-get-programas',
  templateUrl: './get-programas.component.html',
  styleUrls: ['./get-programas.component.scss'],
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
export class GetProgramasComponent {
  frmGetPrograma: FormGroup;
  ListaEscuelas: Escuela[] = [];
  idUser: Number = 0;
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  idUniversidad: Number = 0;
  tituloAccion: string = 'Nuevo Programa';
  botonAccion: string = 'Guardar';

  constructor(
    private dialogoRefencia: MatDialogRef<GetProgramasComponent>,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public datos: Programa,
    private _serviceProgrmas: ProgramaService,
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
      this.cargarEscuelas();
    });

    this.frmGetPrograma = this.fb.group({
      codigo: [this.datos.codigoPrograma, Validators.required],
      CodEscuela: ['', Validators.required],
      nombre: ['', Validators.required],
      tipo: ['', Validators.required],
      modalidad: ['', Validators.required],
      semestres: ['', Validators.required],
      creditos: ['', Validators.required]
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

  cargarEscuelas() {
    if (this.isSuperAdmin) {
      this._esceulaService.get().subscribe({
        next: (data) => {
          this.ListaEscuelas = data;
        },
        error: (e) => {},
      });
    } else {
      this._serviceUserUni.getByUsuario(this.idUser).subscribe({
        next: (data) => {
          if (data.length > 0) {
            this.idUniversidad = data.at(0).idUniversidad;
            this._esceulaService.getByUniversidad(this.idUniversidad).subscribe({
              next: (data2) => {
                this.ListaEscuelas = data2;
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
      this.frmGetPrograma.patchValue({
        id: this.datos.id,
        codigo: this.datos.codigoPrograma,
        CodEscuela: this.datos.codigoEscuela,
        nombre: this.datos.nombre,
        tipo: this.datos.tipo,
        modalidad: this.datos.modalidad,
        semestres: this.datos.cantSemestre,
        creditos: this.datos.totalCreditos,
      });
      this.botonAccion = 'Actualizar';
      this.tituloAccion = 'Actualizar Programa';
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
    const modelo: Programa= {
      id: 0,
      nombreEscuela:'',
      codigoPrograma: this.frmGetPrograma.value.codigo,
      nombre: this.frmGetPrograma.value.nombre,
      tipo: this.frmGetPrograma.value.tipo,
      modalidad: this.frmGetPrograma.value.modalidad,
      cantSemestre:this.frmGetPrograma.value.semestres,
      totalCreditos:this.frmGetPrograma.value.creditos,
      fechaServidor: fechaFormateada,
      estacion: window.location.hostname,
      codigoEscuela: this.frmGetPrograma.value.CodEscuela,
      codigoUniversidad:this.idUniversidad,
      usuario: this.idUser,
    };


    if (this.datos.nombre == '') {
      this._serviceProgrmas.add(modelo).subscribe({
        next: (data) => {
          this.MostrarAlertar('Programa registrado con éxito', 'Listo');
          this.dialogoRefencia.close('Creado');
        },
        error: (e) => {
          this.MostrarAlertar('No se pudo registrar el programa', 'Error');
        },
      });
    } else {
      this._serviceProgrmas.update(this.datos.id, modelo).subscribe({
        next: (data) => {
          this.MostrarAlertar('Programa modificado con éxito', 'Listo');
          this.dialogoRefencia.close('Editado');
        },
        error: (e) => {
          this.MostrarAlertar('No se pudo actualizar el programa', 'Error');
        },
      });
    }
  }
}
