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
import { TipoProducto } from '@app/models/backend/data-universidad/proyecto/tipo-producto';
import { TipoProductoService } from '@app/services/data-universidad/proyecto/tipo-producto.service';

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
  selector: 'app-get-tipos-productos',
  templateUrl: './get-tipos-productos.component.html',
  styleUrls: ['./get-tipos-productos.component.scss'],
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
export class GetTiposProductosComponent {
  frmGetTipoProducto: FormGroup;
  ListaFacultad: Facultad[] = [];
  idUser: Number = 0;
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  idUniversidad: Number = 0;
  tituloAccion: string = 'Nueva Tipo de Producto';
  botonAccion: string = 'Guardar';

  constructor(
    private dialogoRefencia: MatDialogRef<GetTiposProductosComponent>,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public datos: TipoProducto,
    private _serviceTipoProd: TipoProductoService,
    private userStateService: UserStateService,
    private datePipe: DatePipe
  ) {
    this.IdUser().subscribe((id) => {
      this.idUser = id;
      this.IsAdmin().subscribe((is) => {
        this.isAdmin = is;
      });
    });

    this.frmGetTipoProducto = this.fb.group({
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



  ngOnInit(): void {
    if (this.datos && this.datos.nombre != '') {
      this.frmGetTipoProducto.patchValue({
        id: this.datos.id,
        nombre: this.datos.nombre,
      });
      this.botonAccion = 'Actualizar';
      this.tituloAccion = 'Actualizar Tipo de Producto';
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
    const modelo: TipoProducto = {
      id: 0,
      nombre: this.frmGetTipoProducto.value.nombre,
      usuario: this.idUser,
    };

    if (!this.datos) {
      this._serviceTipoProd.add(modelo).subscribe({
        next: (data) => {
          this.MostrarAlertar('Tipo de Producto registrado con éxito', 'Listo');
          this.dialogoRefencia.close('Creado');
        },
        error: (e) => {
          this.MostrarAlertar('No se pudo registrar el tipo de producto', 'Error');
        },
      });
    } else {
      this._serviceTipoProd.update(this.datos.id, modelo).subscribe({
        next: (data) => {
          this.MostrarAlertar('Tipo de Producto modificado con éxito', 'Listo');
          this.dialogoRefencia.close('Editado');
        },
        error: (e) => {
          this.MostrarAlertar('No se pudo actualizar el tipo de producto', 'Error');
        },
      });
    }
  }
}
