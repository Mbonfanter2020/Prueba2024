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
import { TareaSolicitudService } from '@app/services/data-universidad/proyecto/tarea-solicitud.service';
import { UsuarioUniversidadService } from '@app/services/user/usuario-universidad.service';
import { SolicitudMetodologiaTipoProducto } from '@app/models/backend/data-universidad/proyecto/solicitud-metodologia-tipo-producto';
import { SolicitudTarea } from '@app/models/backend/data-universidad/proyecto/solicitud-tarea';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { GetSolicitudTareaComponent } from '../get-solicitud-tarea/get-solicitud-tarea.component';

@Component({
  selector: 'app-lista-tareas-solicitud',
  templateUrl: './lista-tareas-solicitud.component.html',
  styleUrls: ['./lista-tareas-solicitud.component.scss'],
  standalone: true,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
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
export class ListaTareasSolicitudComponent {
  displayedColumns: String[] = [
    'Estado',
    'TipoProducto',
    'Producto',
    'Estudiante',
    'Programa',
    //'FechaAsignacion',
    'FechaEntrega',
    'Porcentaje',
    'Acciones',
    'expand'
  ];

  idUser: Number = 0;
  isAdmin: boolean = false;
  solicitudMetodTipo: SolicitudMetodologiaTipoProducto;
  getDescripcion(element: SolicitudTarea): String {
    return element.descripcion;
  }
  expandedElement: SolicitudMetodologiaTipoProducto |  null = null;
  dataSource = new MatTableDataSource<SolicitudTarea>();
  codicion: string = '';
  idUniversidad: Number = 0;
  isSuperAdmin: boolean = false;

  constructor(
    public dialog: MatDialog,
    private userStateService: UserStateService,
    @Inject(MAT_DIALOG_DATA) public datos: SolicitudMetodologiaTipoProducto,
    private _solicitudTarea: TareaSolicitudService,
    private _snackBar: MatSnackBar,
    private _serviceUserUni: UsuarioUniversidadService
  ) {
    this.solicitudMetodTipo = datos;
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
    this.IdUser().subscribe((id) => {
      this.idUser = id;
      this.IsAdmin().subscribe((is) => {
        this.isAdmin = is;
      });
      this.cargarTareas();
    });
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  cargarTareas() {
      this._solicitudTarea.getByMetodologiaTipoProd(this.solicitudMetodTipo.id).subscribe({
        next: (data) => {
          this.dataSource.data = data;
        },
        error: (e) => {},
      });
  }

  GetTarea() {
    this.dialog
      .open(GetSolicitudTareaComponent, {
        disableClose: true,
        width: '600px',
        data: { idMetTipo: this.solicitudMetodTipo.id },
      })
      .afterClosed()
      .subscribe((resultado) => {
        if (resultado === 'Creado') {
          this.cargarTareas();
        }
      });
  }

  GetTareaEdit(datos: SolicitudTarea) {
    this.dialog
      .open(GetSolicitudTareaComponent, {
        disableClose: true,
        width: '600px',
        data: { idMetTipo: this.solicitudMetodTipo.id,dato:  datos},
      })
      .afterClosed()
      .subscribe((resultado) => {
        if (resultado === 'Editado') {
          this.cargarTareas();
        }
      });
  }

  DeleteMetodologia(datosSolicitud: SolicitudTarea) {
    this.dialog
      .open(GetEliminarComponent, {
        disableClose: true,
        data: {
          componeteEliminar: 'eliminar está tarea',
          tituloAccion: 'Elimnar Tarea',
          datos: datosSolicitud,
        },
      })
      .afterClosed()
      .subscribe((resultado) => {
        if (resultado === 'Eliminar') {
          this._solicitudTarea.delete(datosSolicitud.id).subscribe({
            next: (data) => {
              this.MostrarAlerta(
                'Tarea eliminada con éxido',
                'Eliminado'
              );
              this.cargarTareas();
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
}
