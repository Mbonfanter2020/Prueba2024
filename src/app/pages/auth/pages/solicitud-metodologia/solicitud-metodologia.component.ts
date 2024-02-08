import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
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

@Component({
  selector: 'app-solicitud-docente-estudiante',
  templateUrl: './solicitud-metodologia.component.html',
  styleUrls: ['./solicitud-metodologia.component.scss'],
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
     NgFor, NgIf,
     MatTooltipModule
  ],
})
export class SolicitudMetodologiaComponent implements AfterViewInit, OnInit {
  displayedColumns: String[] = [
    'Id',
    'Metodologia',
    'IdentificacionDoc',
    'NombreDoc',
    'ProgramaDoc',
    'Acciones',
  ];


  idUser : Number = 0;
  isAdmin: boolean = false;
  solicitud: Solicitud
  dataSource = new MatTableDataSource<SolicitudMetodologia>();

  constructor(
    public dialog: MatDialog,
    private userStateService: UserStateService,
    @Inject(MAT_DIALOG_DATA) public datos: Solicitud,
    private _solicitudDocEst: SolicitudMetodologiaService,
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
      this.cargarMetodologias();
    });

  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  cargarMetodologias() {
    this._solicitudDocEst.getBySolicitud(this.solicitud.id).subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (e) => {},
    });

  }

  GetMetodologia(){
    this.dialog.open(GetSolicitudesMetodologiaComponent,{
      disableClose: true,
      width:"600px",
      data: {id: this.solicitud.id,
              nombre:  this.solicitud.titulo
          }
    }).afterClosed().subscribe(resultado => {
      if(resultado === 'Creado'){
        this.cargarMetodologias();
      }
    });
  }

  DeleteMetodologia(datosSolicitud: SolicitudMetodologia){
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
          this._solicitudDocEst.delete(datosSolicitud.id).subscribe({
            next: (data) => {
              this.MostrarAlerta('Metodología eliminada con éxido', 'Eliminado');
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
}
