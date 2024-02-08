import { AfterViewInit, Component, OnInit, ViewChild ,Inject, inject} from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule} from '@angular/common';
import {NgFor, NgIf} from '@angular/common';
import { Observable} from 'rxjs';
import { UserStateService } from '@app/services/login/user-state.service';
import { map } from 'rxjs/operators';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SolicitudParticipanteService } from '@app/services/solicitudes/solicitud-participante.service';
import { SolicitudParticipante } from '@app/models/backend/solicitudes/solicitud-participantes';
import { GetCausaEfectoComponent } from '../get-causa-efecto/get-causa-efecto.component';
import { GetParticipanteSolicitudComponent } from '../get-participante-solicitud/get-participante-solicitud.component';
import { Solicitud } from '@app/models/backend/solicitudes/solicitud';
import { SolicitudService } from '@app/services/solicitudes/solicitud.service';
import { GetEliminarComponent } from '@app/shared/controls/get-eliminar/get-eliminar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-lista-participantes',
  templateUrl: './lista-participantes.component.html',
  styleUrls: ['./lista-participantes.component.scss'],
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatButtonModule,
    FlexLayoutModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    CommonModule,
     NgFor, NgIf,
     MatTooltipModule
  ],
})
export class ListaParticipantesComponent implements AfterViewInit, OnInit {
  displayedColumns: String[] = [
    'Id',
    'TipoDoc',
    'Identificacion',
    'Tercero',
    'Expectativa',
    'Acciones',
  ];


  idUser : Number = 0;
  isAdmin: boolean = false;
  solicitud: Solicitud
  dataSource = new MatTableDataSource<SolicitudParticipante>();

  constructor(
    public dialog: MatDialog,
    private _serviceParticipantes : SolicitudParticipanteService,
    private userStateService: UserStateService,
    @Inject(MAT_DIALOG_DATA) public datos: Solicitud,
    private _solicitudServicio: SolicitudService,
    private _snackBar: MatSnackBar
  ) {
    this.solicitud =  datos;
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

  IsAdmin(): Observable<boolean> {
    return this.userStateService.userState$.pipe(
      map(userState => {
        if(userState.isAdmin == false){
          return false;
        }
        return true;
      })
    );
  }

  ngOnInit(): void {
    this.IdUser().subscribe(id => {
      this.idUser = id;
      this.cargarParticipantes();
    });

  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  cargarParticipantes() {
    this._serviceParticipantes.getByIdSolicitud(this.solicitud.id).subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (e) => {},
    });

  }

  GetParticipante(){
    this.dialog.open(GetParticipanteSolicitudComponent,{
      disableClose: true,
      width:"600px",
      data: {id: this.solicitud.id
          }
    }).afterClosed().subscribe(resultado => {
      if(resultado === 'Creado'){
        this.solicitud.estado = 'Asignada';
          this._solicitudServicio.update(this.solicitud.id,this.solicitud).subscribe({
            next: (data) => {
              this.cargarParticipantes();
            },
            error: (e) => {},
          });

      }
    });
  }

  DeleteParticipante(datosSolicitud: SolicitudParticipante){
    this.dialog
      .open(GetEliminarComponent, {
        disableClose: true,
        data: {
          componeteEliminar: 'rechazar la Solicitud',
          tituloAccion: 'Rechazar Solicitud',
          datos: datosSolicitud,
        },
      })
      .afterClosed()
      .subscribe((resultado) => {
        if (resultado === 'Eliminar') {
          this._serviceParticipantes.delete(datosSolicitud.id).subscribe({
            next: (data) => {
              this.MostrarAlerta('Participante eliminado con éxido', 'Eliminado');
              this.cargarParticipantes();
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
