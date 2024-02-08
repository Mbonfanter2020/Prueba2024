import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DatePipe, NgFor } from '@angular/common';
import { SolicitudMetodologia } from '@app/models/backend/solicitudes/solicitud-metodologia';
import { TipoProducto } from '@app/models/backend/data-universidad/proyecto/tipo-producto';
import { Observable, map } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserStateService } from '@app/services/login/user-state.service';
import { SolicitudMetodologiaService } from '@app/services/data-universidad/universidad/solicitud-metodologia.service';
import { UsuarioTerceroService } from '@app/services/login/usuario-tercero.service';
import { UsuarioService } from '@app/services/user/usuario.service';
import { UsuarioUniversidadService } from '@app/services/user/usuario-universidad.service';
import { SolicitudMetodologiaTipoProductoService } from '@app/services/data-universidad/proyecto/solicitud-metodologia-tipo-producto.service';
import { forkJoin } from 'rxjs';
import { TipoProductoService } from '@app/services/data-universidad/proyecto/tipo-producto.service';
import { SolicitudMetodologiaTipoProducto } from '@app/models/backend/data-universidad/proyecto/solicitud-metodologia-tipo-producto';

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
  selector: 'app-get-tipo-producto',
  templateUrl: './get-tipo-producto.component.html',
  styleUrls: ['./get-tipo-producto.component.scss'],
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
export class GetTipoProductoComponent {
  idUser: Number = 0;
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  idUniversidad: Number = 0;
  tituloAccion: string = 'Metodología - Tipo Producto';
  botonAccion: string = 'Guardar';
  frmGetSolModalidad: FormGroup;
  ListaSoliMetodologia: SolicitudMetodologia[] = [];
  ListaSoliMetodologiaReg: SolicitudMetodologia[] = [];
  ListaTipoProducto: TipoProducto[] = [];
  codicion: string = '';
  restante: number = 100.0;
  primeraVez: boolean = false;
  idSolicitud: Number = 0;
  constructor(
    private dialogoRefencia: MatDialogRef<GetTipoProductoComponent>,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public datos: SolicitudMetodologiaTipoProducto,
    private _solicitudMetService: SolicitudMetodologiaService,
    private _solicitudMetTipoService: SolicitudMetodologiaTipoProductoService,
    private userStateService: UserStateService,
    private datePipe: DatePipe,
    private _serviceUserUni: UsuarioUniversidadService,
    private _serviceTipoProd: TipoProductoService
  ) {
    this.IdUser().subscribe((id) => {
      this.idUser = id;
      this.IsAdmin().subscribe((is) => {
        this.isAdmin = is;
      });
      this._serviceUserUni.getByUsuario(this.idUser).subscribe({
        next: (data) => {
          this.idUniversidad = data.at(0).idUniversidad;
          this.cargarSolicitudMetodologia();
          this.cargarTipoProducto();
        },
        error: (e) => {},
      });
    });

    const today = new Date();

    // Formatear la fecha como YYYY-MM-DD
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2); // Agrega un cero al principio si es necesario
    const day = ('0' + today.getDate()).slice(-2); // Agrega un cero al principio si es necesario

    // Concatenar para obtener el formato YYYY-MM-DD
    const fechaActual = `${year}-${month}-${day}`;

    this.frmGetSolModalidad = this.fb.group({
      fechaAsignacion: [fechaActual, Validators.required],
      fechaEntrega: [fechaActual, Validators.required],
      porcentaje: [this.restante, Validators.required],
      codSolMetodologia: ['', Validators.required],
      CodTipoProducto: ['', Validators.required],
      Descripcion: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.datos && this.datos.nombreMetodogia != '') {
      this.frmGetSolModalidad.patchValue({
        fechaAsignacion: this.datePipe.transform(
          new Date(this.datos.fechaAsignacion),
          'yyyy-MM-dd'
        ),
        fechaEntrega: this.datePipe.transform(
          new Date(this.datos.fechaEntrega),
          'yyyy-MM-dd'
        ),
        porcentaje: this.datos.porcentaje,
        codSolMetodologia: this.datos.idSolicitudMetodologia,
        CodTipoProducto: this.datos.idTipoProducto,
        Descripcion: this.datos.descripcion,
      });
      this.botonAccion = 'Actualizar';
      this.tituloAccion = 'Actualizar Metodología -Tipo Producto';
      this.idSolicitud = this.datos.idSolicitud;
      this.primeraVez = true;
      this.cargarInfo();
    }
  }

  cargarSolicitudMetodologia() {
    if (this.isSuperAdmin) {
      this._solicitudMetService.get().subscribe({
        next: (data) => {
          this.ListaSoliMetodologia = data;
        },
        error: (e) => {},
      });
    } else {
      this._serviceUserUni.getByUsuario(this.idUser).subscribe({
        next: (data) => {
          this.idUniversidad = data.at(0).idUniversidad;
          this._serviceUserUni.getByUniversidad(this.idUniversidad).subscribe({
            next: (users) => {
              this.codicion = '';
              if (users.length > 0) {
                for (const us of users) {
                  this.codicion += `&usuario=${us.idUsuario}`;
                }
                this.codicion = this.codicion.substring(1);
                this._solicitudMetService.getByIds(this.codicion).subscribe({
                  next: (data) => {
                    this.ListaSoliMetodologia = data;
                  },
                  error: (e) => {},
                });
              }
            },
            error: (e) => {},
          });
        },
        error: (e) => {},
      });
    }
  }

  cargarTipoProducto() {
    if (this.isSuperAdmin) {
      this._serviceTipoProd.get().subscribe({
        next: (data) => {
          this.ListaTipoProducto = data;
        },
        error: (e) => {},
      });
    } else {
      this._serviceUserUni.getByUsuario(this.idUser).subscribe({
        next: (data) => {
          this.idUniversidad = data.at(0).idUniversidad;
          this._serviceUserUni.getByUniversidad(this.idUniversidad).subscribe({
            next: (users) => {
              this.codicion = '';
              if (users.length > 0) {
                for (const us of users) {
                  this.codicion += `&usuario=${us.idUsuario}`;
                }
                this.codicion = this.codicion.substring(1);
                this._serviceTipoProd.getByIds(this.codicion).subscribe({
                  next: (data) => {
                    this.ListaTipoProducto = data;
                  },
                  error: (e) => {},
                });
              }
            },
            error: (e) => {},
          });
        },
        error: (e) => {},
      });
    }
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

  Guardar() {
    if (this.frmGetSolModalidad.value.porcentaje > this.restante) {
      this.MostrarAlertar(
        'El porcentaje para esta tipo de producto no puede superar al ' +
          this.restante +
          ' % restante disponible para está solicitud.',
        'Error'
      );
      return;
    }
    const fechaFormateada = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    const modelo: SolicitudMetodologiaTipoProducto = {
      id: 0,
      nombreMetodogia: '',
      codigoSolicitud: '',
      nombreSolicitud: '',
      tipoProducto: '',
      idSolicitud: 0,
      docente: '',
      programa: '',
      fechaAsignacion: this.frmGetSolModalidad.value.fechaAsignacion,
      fechaEntrega: this.frmGetSolModalidad.value.fechaEntrega,
      descripcion: this.frmGetSolModalidad.value.Descripcion,
      porcentaje: this.frmGetSolModalidad.value.porcentaje,
      cumplido: false,
      fechaServidor: fechaFormateada,
      idSolicitudMetodologia: this.frmGetSolModalidad.value.codSolMetodologia,
      idTipoProducto: this.frmGetSolModalidad.value.CodTipoProducto,
      usuario: this.idUser,
    };

    if (!this.datos) {
      this._solicitudMetTipoService.add(modelo).subscribe({
        next: (data) => {
          this.MostrarAlertar(
            'Metodología - Tipo producto registrada con éxito',
            'Listo'
          );
          this.dialogoRefencia.close('Creado');
        },
        error: (e) => {
          this.MostrarAlertar(
            'No se pudo registrar la Metodología - Tipo producto',
            'Error'
          );
        },
      });
    } else {
      this._solicitudMetTipoService.update(this.datos.id, modelo).subscribe({
        next: (data) => {
          this.MostrarAlertar(
            'Metodología - Tipo producto modificada con éxito',
            'Listo'
          );
          this.dialogoRefencia.close('Editado');
        },
        error: (e) => {
          this.MostrarAlertar(
            'No se pudo modificar la Metodología - Tipo producto',
            'Error'
          );
        },
      });
    }
  }

  MostrarAlertar(message: string, action: string) {
    this._snackBar.open(message, action, {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 4000,
    });
  }

  cargarInfo() {
    this.restante = 100;
      if(this.primeraVez){
        this.primeraVez = false;
      }else{
        this.idSolicitud  = this.ListaSoliMetodologia.filter(
          (metodologia) =>
            metodologia.id == this.frmGetSolModalidad.value.codSolMetodologia
        ).at(0).idSolicitud;
      }


      this._solicitudMetService.getBySolicitud(this.idSolicitud).subscribe({
        next: (data) => {
          if (data.length > 0) {
            const observables = data.map((metodologias) => {
              return this._solicitudMetTipoService.getByIdMetodologia(
                metodologias.id
              );
            });

            forkJoin(observables).subscribe({
              next: (data2Array) => {
                data2Array.forEach((data2) => {
                  this.restante -= data2.reduce(
                    (total, meto) => total + meto.porcentaje,
                    0
                  );
                });
                this.restante = this.datos
                  ? this.restante + this.datos.porcentaje
                  : this.restante;
                this.frmGetSolModalidad
                  .get('porcentaje')
                  .setValue(this.restante);
              },
              error: (e) => {},
            });
          }
        },
        error: (e) => {},
      });
  }

  CargarInfoMetodologia(event: any) {
    this.cargarInfo();
  }
}
