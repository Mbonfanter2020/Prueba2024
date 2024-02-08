import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
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
import { EscuelaService } from '@app/services/data-universidad/universidad/escuela.service';
import { UniversidadService } from '@app/services/data-universidad/universidad/universidad.service';
import { UserStateService } from '@app/services/login/user-state.service';
import { UsuarioUniversidadService } from '@app/services/user/usuario-universidad.service';
import { GetEliminarComponent } from '@app/shared/controls/get-eliminar/get-eliminar.component';
import { Observable, map } from 'rxjs';
import { GetEscuelaComponent } from '../get-escuela/get-escuela.component';
import { MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';
import { Programa } from '@app/models/backend/data-universidad/universidad/programa';
import { ProgramaService } from '@app/services/data-universidad/universidad/programa.service';
import { GetProgramasComponent } from '../get-programas/get-programas.component';
import { Producto } from '@app/models/backend/data-universidad/proyecto/producto';
import { ProductoService } from '@app/services/data-universidad/proyecto/producto.service';
import { GetProductoComponent } from '../get-producto/get-producto.component';

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
  selector: 'app-lista-producto',
  templateUrl: './lista-producto.component.html',
  styleUrls: ['./lista-producto.component.scss'],
  providers : [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },DatePipe
  ],
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
export class ListaProductoComponent  implements AfterViewInit, OnInit  {
  displayedColumns: String[] = [
    'Codigo',
    'Titulo',
    'Tipo',
    'FechaPublicacion',
    'Entidad',
    'NroRegistro',
    'Fecha',
    'Acciones',
  ];


  idUser : Number = 0;
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  idUniversidad: Number = 0;
  codicion: string = '';
  dataSource = new MatTableDataSource<Producto>();

  constructor(
    public dialog: MatDialog,
    private userStateService: UserStateService,
    private _serviceUniversidad: UniversidadService,
    private _serviceProducto: ProductoService,
    private _snackBar: MatSnackBar,
    private _serviceUserUni: UsuarioUniversidadService,
    private datePipe: DatePipe
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
      this.cargarProductos();
    });

  }

  @ViewChild(MatPaginator) paginator!: MatPaginator
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  cargarProductos() {
    if(this.isSuperAdmin){
      this._serviceProducto.get().subscribe({
        next: (data) => {
          this.dataSource.data = data;
        },
        error: (e) => {},
      });
    }else{
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
                    this._serviceProducto.getByIds(this.codicion).subscribe({
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

  GetProducto(){
    this._serviceProducto.get().subscribe({
      next: (data) => {
        const maximo = data.length > 0 ? ( Number(data.reduce((max, item) => item.codigoProducto > max ? item.codigoProducto : max, data[0].codigoProducto)) +1):1;
        const consecutivo = maximo.toString().padStart(10, '0');
        const fechaFormateada = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
        const producto: Producto = {
          id:0,
          nombreTipoProducto:'',
          codigoProducto:consecutivo,
          titulo:'',
          fechaCreacion:new Date(),
          entidadPublicacion:'',
          numeroRegistro:'',
          fechaServidor:fechaFormateada,
          estacion:'',
          codigoTipoProd: 0,
          codigoProy: 0,
          usuario:0
      }
      this.dialog
      .open(GetProductoComponent, {
        disableClose: true,
        width: '500px',
        data: producto
      })
      .afterClosed().subscribe((resultado) => {
        if (resultado === 'Creado') {
          this.cargarProductos();
        }
      });
    },

      error: (e) => {},
    });
  }

  GetProductoEdit(datos: Producto){
    this.dialog.open(GetProductoComponent,{
      disableClose: true,
      width:"600px",
      data: datos
    }).afterClosed().subscribe(resultado => {
      if(resultado === 'Editado'){
        this.cargarProductos();
      }
    });
  }


  DeleteProducto(datos: Programa){
    this.dialog
      .open(GetEliminarComponent, {
        disableClose: true,
        data: {
          componeteEliminar: 'eliminar producto',
          tituloAccion: 'Eliminar Producto',
          datos: datos,
        },
      })
      .afterClosed()
      .subscribe((resultado) => {
        if (resultado === 'Eliminar') {
          this._serviceProducto.delete(datos.id).subscribe({
            next: (data) => {
              this.MostrarAlerta('Producto eliminado con éxido', 'Eliminado');
              this.cargarProductos();
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
