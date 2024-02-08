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
import { TerceroService } from '@app/services/user/tercero.service';
import { Tercero } from '@app/models/backend/user/tercero';
import { TerceroProgramaService } from '@app/services/data-universidad/universidad/tercero-programa.service';
import { ProductoService } from '@app/services/data-universidad/proyecto/producto.service';
import { Producto } from '@app/models/backend/data-universidad/proyecto/producto';
import { TareaSolicitudService } from '@app/services/data-universidad/proyecto/tarea-solicitud.service';
import { SolicitudTarea } from '@app/models/backend/data-universidad/proyecto/solicitud-tarea';
import { isEmpty } from 'lodash';

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
  selector: 'app-get-solicitud-tarea',
  templateUrl: './get-solicitud-tarea.component.html',
  styleUrls: ['./get-solicitud-tarea.component.scss'],
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
export class GetSolicitudTareaComponent {
  idUser: Number = 0;
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  idUniversidad: Number = 0;
  tituloAccion: string = 'Metodología - Producto';
  botonAccion: string = 'Guardar';
  frmGetSolModalidad: FormGroup;
  ListaEstudiantes: Tercero[] = [];
  ListaProducto: Producto[] = [];
  codicion: string = '';
  restante: number = 100.0;
  primeraVez: boolean = false;
  TipoProdId: Number = 0;
  constructor(
    private dialogoRefencia: MatDialogRef<GetSolicitudTareaComponent>,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public datos: any,
    private _terceroServices: TerceroService,
    private _solicitudTareaService: TareaSolicitudService,
    private userStateService: UserStateService,
    private datePipe: DatePipe,
    private _serviceUserUni: UsuarioUniversidadService,
    private _serviceUserTer: UsuarioTerceroService,
    private _serviceTercero: TerceroService,
    private _servicesUsuario: UsuarioService,
    private _serviceTerceroPrograma: TerceroProgramaService,
    private _serviceProducto: ProductoService,
    private _solicitudTarea: TareaSolicitudService
  ) {
    this.TipoProdId = datos.idMetTipo;
    this.IdUser().subscribe((id) => {
      this.idUser = id;
      this.IsAdmin().subscribe((is) => {
        this.isAdmin = is;
      });
      this._serviceUserUni.getByUsuario(this.idUser).subscribe({
        next: (data) => {
          this.idUniversidad = data.at(0).idUniversidad;
          this.cargarEstudiante();
          this.cargarProducto();
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
      codProducto: ['', Validators.required],
      codEstudiante: ['', Validators.required],
      Descripcion: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.datos.dato && this.datos.dato.nombreMetodogia != '') {
      this.frmGetSolModalidad.patchValue({
        fechaAsignacion: this.datePipe.transform(
          new Date(this.datos.dato.fechaAsignacion),
          'yyyy-MM-dd'
        ),
        fechaEntrega: this.datePipe.transform(
          new Date(this.datos.dato.fechaEntrega),
          'yyyy-MM-dd'
        ),
        porcentaje: this.datos.dato.porcentaje,
        codProducto: this.datos.dato.idProducto,
        codEstudiante: this.datos.dato.idEstudiante,
        Descripcion: this.datos.dato.descripcion,
      });
      this.botonAccion = 'Actualizar';
      this.tituloAccion = 'Actualizar Tarea';

      this.primeraVez = true;
      this.cargarInfo();
    }
  }

  cargarEstudiante() {
    if (this.isSuperAdmin) {
      this._serviceTercero.get().subscribe({
        next: (data) => {
          this.ListaEstudiantes = data;
        },
        error: (e) => {},
      });
    } else {
      this._serviceUserUni.getByUniversidad(this.idUniversidad).subscribe({
        next: (users) => {
          this.codicion = '';
          if (users.length > 0) {
            for (const us of users) {
              this.codicion += `&id_usuario=${us.idUsuario}`;
            }
            this.codicion = this.codicion.substring(1);
            this._serviceUserTer.getByIdsUser(this.codicion).subscribe({
              next: (data2) => {
                this.codicion = '';

                const observables = [];

                for (const us of data2) {
                  const observable = this._servicesUsuario.getById(
                    us.id_usuario
                  );
                  observables.push(observable);
                }

                forkJoin(observables).subscribe((datausers) => {
                  for (let i = 0; i < data2.length; i++) {
                    const us = data2[i];
                    const datauser = datausers[i];

                    if (datauser.nombreRol == 'Estudiante') {
                      this.codicion += `&id=${us.id_tercero}`;
                    }
                  }

                  this.codicion = this.codicion.substring(1);
                  if(isEmpty(this.codicion)){
                    this.ListaEstudiantes = [];
                  }else{
                    this._serviceTercero.getByIds(this.codicion).subscribe({
                      next: (data) => {
                        this.ListaEstudiantes = data;
                      },
                      error: (e) => {},
                    });
                  }

                });
              },
              error: (e) => {},
            });
          }
        },
        error: (e) => {},
      });
    }
  }

  cargarProducto() {
    if (this.isSuperAdmin) {
      this._serviceProducto.get().subscribe({
        next: (data) => {
          this.ListaProducto = data;
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
                this._serviceProducto.getByIds(this.codicion).subscribe({
                  next: (data) => {
                    this.ListaProducto = data;
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
        'El porcentaje para este producto no puede superar al ' +
          this.restante +
          ' % restante disponible para este tipo de producto.',
        'Error'
      );
      return;
    }

    this._serviceTerceroPrograma
      .getByTercero(this.frmGetSolModalidad.value.codEstudiante)
      .subscribe({
        next: (data2) => {

          if(data2.length > 0){
            const fechaFormateada = this.datePipe.transform(
              new Date(),
              'yyyy-MM-dd'
            );
            const modelo: SolicitudTarea = {
              id: 0,
              nombreMetodogia: '',
              codigoSolicitud: '',
              idSolicitud: 0,
              tipoProducto: '',
              producto: '',
              estudiante: '',
              programa: '',
              fechaAsignacion: this.frmGetSolModalidad.value.fechaAsignacion,
              fechaEntrega: this.frmGetSolModalidad.value.fechaEntrega,
              descripcion: this.frmGetSolModalidad.value.Descripcion,
              porcentaje: this.frmGetSolModalidad.value.porcentaje,
              cumplido: false,
              idSolicitudMetodologiaTipoProducto: this.TipoProdId,
              idEstudiante: this.frmGetSolModalidad.value.codEstudiante,
              idProgramaEst: data2.at(0).idPrograma,
              idProducto: this.frmGetSolModalidad.value.codProducto,
              usuario: this.idUser,
            };

            if (!this.datos.dato) {
              this._solicitudTareaService.add(modelo).subscribe({
                next: (data) => {
                  this.MostrarAlertar('Tarea registrada con éxito', 'Listo');
                  this.dialogoRefencia.close('Creado');
                },
                error: (e) => {
                  this.MostrarAlertar('No se pudo registrar la tarea', 'Error');
                },
              });
            } else {
              this._solicitudTareaService
                .update(this.datos.dato.id, modelo)
                .subscribe({
                  next: (data) => {
                    this.MostrarAlertar('tarea modificada con éxito', 'Listo');
                    this.dialogoRefencia.close('Editado');
                  },
                  error: (e) => {
                    this.MostrarAlertar('No se pudo modificar la tarea', 'Error');
                  },
                });
            }
          }else{
            this.MostrarAlertar("El estudiante no tiene asociado un programa, por favor verifique.","Error");
          }

        },
        error: (e) => {},
      });
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
    this._solicitudTarea.getByMetodologiaTipoProd(this.TipoProdId).subscribe({
      next: (data) => {
        this.restante -= data.reduce(
          (total, meto) => total + meto.porcentaje,
          0
        );
        this.restante = this.datos.dato
          ? this.restante + this.datos.dato.porcentaje
          : this.restante;
        this.frmGetSolModalidad.get('porcentaje').setValue(this.restante);
      },
      error: (e) => {},
    });
  }

  CargarInfoMetodologia(event: any) {
    this.cargarInfo();
  }
}
