
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
import { TipoProducto } from '@app/models/backend/data-universidad/proyecto/tipo-producto';
import { TipoProductoService } from '@app/services/data-universidad/proyecto/tipo-producto.service';
import { Producto } from '@app/models/backend/data-universidad/proyecto/producto';
import { ProductoService } from '@app/services/data-universidad/proyecto/producto.service';

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
  selector: 'app-get-producto',
  templateUrl: './get-producto.component.html',
  styleUrls: ['./get-producto.component.scss'],
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
export class GetProductoComponent {
  frmGetProducto: FormGroup;
  ListaTipoProductos: TipoProducto[] = [];
  idUser: Number = 0;
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  idUniversidad: Number = 0;
  tituloAccion: string = 'Nuevo Programa';
  botonAccion: string = 'Guardar';
  codicion : string = '';

  constructor(
    private dialogoRefencia: MatDialogRef<GetProductoComponent>,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public datos: Producto,
    private _serviceProducto: ProductoService,
    private _serviceUserUni: UsuarioUniversidadService,
    private _serviceTipoProd: TipoProductoService,
    private userStateService: UserStateService,
    private datePipe: DatePipe
  ) {
    this.IdUser().subscribe((id) => {
      this.idUser = id;
      this.IsAdmin().subscribe((is) => {
        this.isAdmin = is;
      });
      this.cargarTipoProductos();
    });

    const fechaFormateada = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

    this.frmGetProducto = this.fb.group({
      codigo: [this.datos.codigoProducto, Validators.required],
      CodTipoProducto: ['', Validators.required],
      nombre: ['', Validators.required],
      entidad: ['', Validators.nullValidator],
      nroRegistro: ['', Validators.nullValidator],
      fechaPublicacion: [fechaFormateada, Validators.nullValidator]
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

  cargarTipoProductos() {
    if (this.isSuperAdmin) {
      this._serviceTipoProd.get().subscribe({
        next: (data) => {
          this.ListaTipoProductos = data;
        },
        error: (e) => {},
      });
    } else {
      this._serviceUserUni.getByUsuario(this.idUser).subscribe({
        next: (data) => {
          if (data.length > 0) {
            this.idUniversidad = data.at(0).idUniversidad;
            this._serviceUserUni
              .getByUniversidad(this.idUniversidad)
              .subscribe({
                next: (users) => {
                  this.codicion = '';
                  if (users.length > 0) {
                    for (const us of users) {
                      this.codicion += `&usuario=${us.idUsuario}`;
                    }
                    this.codicion = this.codicion.substring(1);
                    this._serviceTipoProd.getByIds(this.codicion).subscribe({
                      next: (data) => {
                        this.ListaTipoProductos= data;
                      },
                      error: (e) => {},
                    });
                  }
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
    if (this.datos && this.datos.titulo != '') {
      this.frmGetProducto.patchValue({
        id: this.datos.id,
        codigo: this.datos.codigoProducto,
        CodTipoProducto: this.datos.codigoTipoProd,
        nombre: this.datos.titulo,
        entidad: this.datos.entidadPublicacion,
        nroRegistro: this.datos.numeroRegistro,
        fechaPublicacion: this.datos.fechaCreacion,
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
    const modelo: Producto= {
      id: 0,
      nombreTipoProducto:'',
      codigoProducto: this.frmGetProducto.value.codigo,
      titulo: this.frmGetProducto.value.nombre,
      fechaCreacion:this.frmGetProducto.value.fechaPublicacion,
      entidadPublicacion: this.frmGetProducto.value.entidad,
      numeroRegistro: this.frmGetProducto.value.nroRegistro,
      fechaServidor: fechaFormateada,
      estacion: window.location.hostname,
      codigoTipoProd: this.frmGetProducto.value.CodTipoProducto,
      codigoProy:null,
      usuario: this.idUser,
    };


    if (this.datos.titulo == '') {
      this._serviceProducto.add(modelo).subscribe({
        next: (data) => {
          this.MostrarAlertar('Producto registrado con éxito', 'Listo');
          this.dialogoRefencia.close('Creado');
        },
        error: (e) => {
          this.MostrarAlertar('No se pudo registrar el producto', 'Error');
        },
      });
    } else {
      this._serviceProducto.update(this.datos.id, modelo).subscribe({
        next: (data) => {
          this.MostrarAlertar('Producto modificado con éxito', 'Listo');
          this.dialogoRefencia.close('Editado');
        },
        error: (e) => {
          this.MostrarAlertar('No se pudo actualizar el producto', 'Error');
        },
      });
    }
  }
}
