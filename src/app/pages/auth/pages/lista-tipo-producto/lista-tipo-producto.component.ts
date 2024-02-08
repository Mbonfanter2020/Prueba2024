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
import { Escuela } from '@app/models/backend/data-universidad/universidad/escuela';
import { UserStateService } from '@app/services/login/user-state.service';
import { UsuarioUniversidadService } from '@app/services/user/usuario-universidad.service';
import { GetEliminarComponent } from '@app/shared/controls/get-eliminar/get-eliminar.component';
import { Observable, map } from 'rxjs';
import { GetEscuelaComponent } from '../get-escuela/get-escuela.component';
import { Programa } from '@app/models/backend/data-universidad/universidad/programa';
import { TipoProductoService } from '@app/services/data-universidad/proyecto/tipo-producto.service';
import { TipoProducto } from '@app/models/backend/data-universidad/proyecto/tipo-producto';
import { GetTiposProductosComponent } from '../get-tipos-productos/get-tipos-productos.component';

@Component({
  selector: 'app-lista-tipo-producto',
  templateUrl: './lista-tipo-producto.component.html',
  styleUrls: ['./lista-tipo-producto.component.scss'],
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
export class ListaTipoProductoComponent   implements AfterViewInit, OnInit   {
  displayedColumns: String[] = [
    'Id',
    'Nombre',
    'Acciones',
  ];


  idUser : Number = 0;
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  idUniversidad: Number = 0;
  dataSource = new MatTableDataSource<TipoProducto>();

  constructor(
    public dialog: MatDialog,
    private userStateService: UserStateService,
    private _serviceTipoProductos: TipoProductoService,
    private _snackBar: MatSnackBar,
    private _serviceUserUni: UsuarioUniversidadService,
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
      this.cargarTiposProductos();
    });

  }

  @ViewChild(MatPaginator) paginator!: MatPaginator
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  cargarTiposProductos() {
    if(this.isSuperAdmin){
      this._serviceTipoProductos.get().subscribe({
        next: (data) => {
          this.dataSource.data = data;
        },
        error: (e) => {},
      });
    }else{
      this._serviceUserUni.getByUsuario(this.idUser).subscribe({
        next: (data) => {
          this._serviceTipoProductos.get().subscribe({
            next: (data2) => {
              this.dataSource.data = data2;
            },
            error: (e) => {},
          });

        },
        error: (e) => {},
      });
    }


  }

  GetTiposProductos(){
    this.dialog.open(GetTiposProductosComponent,{
      disableClose: true,
      width:"450px",
    }).afterClosed().subscribe(resultado => {
      if(resultado === 'Creado'){
        this.cargarTiposProductos();
      }
    });
  }

  GetTiposProductosEdit(datos: TipoProducto){
    this.dialog.open(GetTiposProductosComponent,{
      disableClose: true,
      width:"450px",
      data: datos
    }).afterClosed().subscribe(resultado => {
      if(resultado === 'Editado'){
        this.cargarTiposProductos();
      }
    });
  }



  DeleteTiposProductos(datos: Programa){
    this.dialog
      .open(GetEliminarComponent, {
        disableClose: true,
        data: {
          componeteEliminar: 'eliminar tipo de producto',
          tituloAccion: 'Eliminar Tipo Producto',
          datos: datos,
        },
      })
      .afterClosed()
      .subscribe((resultado) => {
        if (resultado === 'Eliminar') {
          this._serviceTipoProductos.delete(datos.id).subscribe({
            next: (data) => {
              this.MostrarAlerta('Tipo de producto eliminado con éxido', 'Eliminado');
              this.cargarTiposProductos();
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
