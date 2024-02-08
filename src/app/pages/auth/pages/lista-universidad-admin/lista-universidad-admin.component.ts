import { CommonModule, NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Universidad } from '@app/models/backend/data-universidad/universidad/universidad';
import { UniversidadService } from '@app/services/data-universidad/universidad/universidad.service';
import { UserStateService } from '@app/services/login/user-state.service';
import { Observable, map } from 'rxjs';
import { UniversidadesComponent } from '../universidades/universidades.component';
import { GetEliminarComponent } from '@app/shared/controls/get-eliminar/get-eliminar.component';
import { UsuarioUniversidadService } from '@app/services/user/usuario-universidad.service';
import { MetodologiaComponent } from '../metodologia/metodologia.component';

@Component({
  selector: 'app-lista-universidad-admin',
  templateUrl: './lista-universidad-admin.component.html',
  styleUrls: ['./lista-universidad-admin.component.scss'],
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
export class ListaUniversidadAdminComponent implements AfterViewInit, OnInit {
  displayedColumns: String[] = [
    'Alias',
    'Nombre',
    'TipoDoc',
    'Identificacion',
    'Fecha',
    'Acciones',
  ];


  idUser : Number = 0;
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  universidad: Universidad
  dataSource = new MatTableDataSource<Universidad>();

  constructor(
    public dialog: MatDialog,
    private userStateService: UserStateService,
    private _serviceUniversidad: UniversidadService,
    private _serviceUserUni: UsuarioUniversidadService,
    private _snackBar: MatSnackBar
  ) {

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
        this.isSuperAdmin = userState.isSuperAdmin;
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
      this.IsAdmin().subscribe(is => {
        this.isAdmin = is;
      });
      this.cargarUniversidades();
    });

  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  cargarUniversidades() {
    if(this.isSuperAdmin){
      this._serviceUniversidad.get().subscribe({
        next: (data) => {
          this.dataSource.data = data;
        },
        error: (e) => {},
      });
    }else{
      this._serviceUserUni.getByUsuario(this.idUser).subscribe({
        next: (data) => {
          this._serviceUniversidad.getById(data.at(0).idUniversidad).subscribe({
            next: (data2) => {
              const uni: Universidad[] = [];
              uni.push(data2);
              this.dataSource.data = uni;
            },
            error: (e) => {},
          });

        },
        error: (e) => {},
      });
    }


  }

  GetUniversidad(){
    this.dialog.open(UniversidadesComponent,{
      disableClose: true,
      width:"600px",
    }).afterClosed().subscribe(resultado => {
      if(resultado === 'Creado'){
        this.cargarUniversidades();
      }
    });
  }

  GetUniversidadEdit(datos: Universidad){
    this.dialog.open(UniversidadesComponent,{
      disableClose: true,
      width:"600px",
      data: datos
    }).afterClosed().subscribe(resultado => {
      if(resultado === 'Editado'){
        this.cargarUniversidades();
      }
    });
  }



  DeleteUniversidad(datos: Universidad){
    this.dialog
      .open(GetEliminarComponent, {
        disableClose: true,
        data: {
          componeteEliminar: 'eliminar universidad',
          tituloAccion: 'Eliminar Universidad',
          datos: datos,
        },
      })
      .afterClosed()
      .subscribe((resultado) => {
        if (resultado === 'Eliminar') {
          this._serviceUniversidad.delete(datos.id).subscribe({
            next: (data) => {
              this.MostrarAlerta('Universidd eliminada con éxido', 'Eliminado');
              this.cargarUniversidades();
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

  ListaMetodologia(universidad: Universidad){
    this.dialog
      .open(MetodologiaComponent, {
        disableClose: true,
        width: '600px',
        height:'400px',
        data : universidad.id
      })
      .afterClosed()
      .subscribe((resultado) => {
      });
  }
}
