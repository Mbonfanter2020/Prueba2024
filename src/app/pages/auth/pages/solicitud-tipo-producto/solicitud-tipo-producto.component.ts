import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Solicitud } from '@app/models/backend/solicitudes/solicitud';
import { SolicitudMetodologia } from '@app/models/backend/solicitudes/solicitud-metodologia';
import { UserStateService } from '@app/services/login/user-state.service';
import { GetEliminarComponent } from '@app/shared/controls/get-eliminar/get-eliminar.component';
import { Observable, map } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SolicitudMetodologiaService } from '@app/services/data-universidad/universidad/solicitud-metodologia.service';
import { GetSolicitudesMetodologiaComponent } from '../get-solicitudes-metodologia/get-solicitudes-metodologia.component';
import { SolicitudMetodologiaTipoProductoService } from '@app/services/data-universidad/proyecto/solicitud-metodologia-tipo-producto.service';
import { SolicitudMetodologiaTipoProducto } from '@app/models/backend/data-universidad/proyecto/solicitud-metodologia-tipo-producto';
import { GetTipoProductoComponent } from '../get-tipo-producto/get-tipo-producto.component';
import { ListaTareasSolicitudComponent } from '../lista-tareas-solicitud/lista-tareas-solicitud.component';
import { UsuarioUniversidadService } from '@app/services/user/usuario-universidad.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-solicitud-tipo-producto',
  templateUrl: './solicitud-tipo-producto.component.html',
  styleUrls: ['./solicitud-tipo-producto.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatButtonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    CommonModule,
    NgFor,
    NgIf,
    MatTooltipModule,
  ],
})
export class SolicitudTipoProductoComponent implements AfterViewInit, OnInit {
  displayedColumns: String[] = [
    'Estado',
    'NroSolicitud',
    'NomMetodologia',
    'Docente',
    'Programa',
    'TipoProducto',
    //'FechaAsignacion',
    'FechaEntrega',
    'Porcentaje',
    'Acciones',
    'expand'
  ];

  idUser: Number = 0;
  isAdmin: boolean = false;
  solicitud: Solicitud;
  getDescripcion(element: SolicitudMetodologiaTipoProducto): String {
    return element.descripcion;
  }
  expandedElement: SolicitudMetodologiaTipoProducto |  null = null;

  dataSource = new MatTableDataSource<SolicitudMetodologiaTipoProducto>();
  codicion: string = '';
  idUniversidad: Number = 0;
  isSuperAdmin: boolean = false;

  constructor(
    public dialog: MatDialog,
    private userStateService: UserStateService,
    private _solicitudTipoProd: SolicitudMetodologiaTipoProductoService,
    private _snackBar: MatSnackBar,
    private _serviceUserUni: UsuarioUniversidadService
  ) {}

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
    this.IdUser().subscribe((id) => {
      this.idUser = id;
      this.IsAdmin().subscribe((is) => {
        this.isAdmin = is;
      });
      this.cargarMetodologias();
    });
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  cargarMetodologias() {
    if (this.isSuperAdmin) {
      this._solicitudTipoProd.get().subscribe({
        next: (data) => {
          this.dataSource.data = data;
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
                    this._solicitudTipoProd.getByIds(this.codicion).subscribe({
                      next: (data) => {
                        this.dataSource.data = data;
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

  GetMetodologiaEdit(datos: SolicitudMetodologiaTipoProducto) {
    this.dialog
      .open(GetTipoProductoComponent, {
        disableClose: true,
        width: '600px',
        data: datos,
      })
      .afterClosed()
      .subscribe((resultado) => {
        if (resultado === 'Editado') {
          this.cargarMetodologias();
        }
      });
  }

  GetSolicitudMetodologia() {
    this.dialog
      .open(GetTipoProductoComponent, {
        disableClose: true,
        width: '600px',
        data: '',
      })
      .afterClosed()
      .subscribe((resultado) => {
        if (resultado === 'Creado') {
          this.cargarMetodologias();
        }
      });
  }

  DeleteMetodologia(datosSolicitud: SolicitudMetodologia) {
    this.dialog
      .open(GetEliminarComponent, {
        disableClose: true,
        data: {
          componeteEliminar: 'eliminar está metodología',
          tituloAccion: 'Elimnar Metodología',
          datos: datosSolicitud,
        },
      })
      .afterClosed()
      .subscribe((resultado) => {
        if (resultado === 'Eliminar') {
          this._solicitudTipoProd.delete(datosSolicitud.id).subscribe({
            next: (data) => {
              this.MostrarAlerta(
                'Metodología eliminada con éxido',
                'Eliminado'
              );
              this.cargarMetodologias();
            },
            error: (e) => {},
          });
        }
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  MostrarAlerta(message: string, action: string) {
    this._snackBar.open(message, action, {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 4000,
    });
  }

  AsociarEstudiante(metodologia: SolicitudMetodologiaTipoProducto) {
    this.dialog
      .open(ListaTareasSolicitudComponent, {
        disableClose: true,
        width: '1400px',
        height: '450px',
        data: metodologia,
      })
      .afterClosed()
      .subscribe((resultado) => {
        if (resultado === 'Editado') {
          this.cargarMetodologias();
        }
      });
  }
}
