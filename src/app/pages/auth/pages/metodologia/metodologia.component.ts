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
import { SolicitudParticipante } from '@app/models/backend/solicitudes/solicitud-participantes';
import { Solicitud } from '@app/models/backend/solicitudes/solicitud';
import { GetEliminarComponent } from '@app/shared/controls/get-eliminar/get-eliminar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Metodologia } from '@app/models/backend/data-universidad/proyecto/metodologia';
import { MetodologiaService } from '@app/services/data-universidad/universidad/metodologia.service';
import { UsuarioUniversidadService } from '@app/services/user/usuario-universidad.service';
import { GetMetodologiaUniversidadComponent } from '../get-metodologia-universidad/get-metodologia-universidad.component';
import { MAT_DATE_FORMATS } from '@angular/material/core';
@Component({
  selector: 'app-metodologia',
  templateUrl: './metodologia.component.html',
  styleUrls: ['./metodologia.component.scss'],
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
export class MetodologiaComponent  implements AfterViewInit, OnInit{
  displayedColumns: String[] = [
    'Id',
    'Nombre',
    'Acciones',
  ];


  idUser : Number = 0;
  isAdmin: boolean = false;
  solicitud: Solicitud
  dataSource = new MatTableDataSource<Metodologia>();
  idUniversidad : Number = 0;
  codicion:string = '';


  constructor(
    public dialog: MatDialog,
    private _serviceMetodologia: MetodologiaService,
    private userStateService: UserStateService,
    @Inject(MAT_DIALOG_DATA) public datos: Number,
    private _serviceUserUni: UsuarioUniversidadService,
    private _snackBar: MatSnackBar,
  ) {
    this.idUniversidad =  datos;
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
      this.cargarMatodologia();
    });

  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  cargarMatodologia() {
    this._serviceUserUni.getByUniversidad(this.idUniversidad).subscribe({
      next: (users) => {
        this.codicion = '';
        if(users.length > 0){
          for (const us of users) {
            this.codicion += `&usuario=${us.idUsuario}`
          }
          this.codicion = this.codicion .substring(1);
          this._serviceMetodologia.getByIds(this.codicion).subscribe({
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

  GetMetodologia(){
    this.dialog.open(GetMetodologiaUniversidadComponent,{
      disableClose: true,
      width:"600px",
    }).afterClosed().subscribe(resultado => {
      if(resultado === 'Creado'){
        this.cargarMatodologia();
      }
    });
  }

  GetMetodologiaEdit(datos: Metodologia){
    this.dialog.open(GetMetodologiaUniversidadComponent,{
      disableClose: true,
      width:"600px",
      data :datos
    }).afterClosed().subscribe(resultado => {
      if(resultado === 'Editado'){
        this.cargarMatodologia();
      }
    });
  }

  DeleteMetodologia(datos: Metodologia){
    this.dialog
      .open(GetEliminarComponent, {
        disableClose: true,
        data: {
          componeteEliminar: 'eliminar la metodología',
          tituloAccion: 'Eliminar Metodología - Universidad',
          datos: datos,
        },
      })
      .afterClosed()
      .subscribe((resultado) => {
        if (resultado === 'Eliminar') {
          this._serviceMetodologia.delete(datos.id).subscribe({
            next: (data) => {
              this.MostrarAlerta('Metodología - Universidadeliminada con éxito', 'Eliminado');
              this.cargarMatodologia();
            },
            error: (e) => {this.MostrarAlerta('No se pudo eliminar la metodología.', 'Eliminado');},
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
