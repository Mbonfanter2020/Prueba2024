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
import { FacultadService } from '@app/services/data-universidad/universidad/facultad.service';
import { UniversidadService } from '@app/services/data-universidad/universidad/universidad.service';
import { UserStateService } from '@app/services/login/user-state.service';
import { UsuarioUniversidadService } from '@app/services/user/usuario-universidad.service';
import { GetEliminarComponent } from '@app/shared/controls/get-eliminar/get-eliminar.component';
import { Observable, map } from 'rxjs';
import { GetEscuelaComponent } from '../get-escuela/get-escuela.component';
import { MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';

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
  selector: 'app-lista-escuela',
  templateUrl: './lista-escuela.component.html',
  styleUrls: ['./lista-escuela.component.scss'],
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
export class ListaEscuelaComponent  implements AfterViewInit, OnInit  {
  displayedColumns: String[] = [
    'Codigo',
    'Nombre',
    'Facultad',
    'Fecha',
    'Acciones',
  ];


  idUser : Number = 0;
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  dataSource = new MatTableDataSource<Escuela>();

  constructor(
    public dialog: MatDialog,
    private userStateService: UserStateService,
    private _serviceUniversidad: UniversidadService,
    private _serviceEscuela: EscuelaService,
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
      this.cargarEscuelas();
    });

  }

  @ViewChild(MatPaginator) paginator!: MatPaginator
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  cargarEscuelas() {
    if(this.isSuperAdmin){
      this._serviceEscuela.get().subscribe({
        next: (data) => {
          this.dataSource.data = data;
        },
        error: (e) => {},
      });
    }else{
      this._serviceUserUni.getByUsuario(this.idUser).subscribe({
        next: (data) => {
          this._serviceEscuela.getByUniversidad(data.at(0).idUniversidad).subscribe({
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

  GetEscuela(){
    this._serviceEscuela.get().subscribe({
      next: (data) => {
        const maximo = data.length > 0 ? ( Number(data.reduce((max, item) => item.codigoEscuela > max ? item.codigoEscuela : max, data[0].codigoEscuela)) +1):1;
        const consecutivo = maximo.toString().padStart(4, '0');
        const fechaFormateada = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
        const sede: Escuela = {
          id:null,
          nombreFacultad:'',
          codigoEscuela:consecutivo,
          nombre:'',
          fechaServidor:fechaFormateada,
          estacion:'',
          codigoFacultad:0,
          codigoUniversidad:0,
          usuario:0
      }
      this.dialog
      .open(GetEscuelaComponent, {
        disableClose: true,
        width: '500px',
        data: sede
      })
      .afterClosed().subscribe((resultado) => {
        if (resultado === 'Creado') {
          this.cargarEscuelas();
        }
      });
    },

      error: (e) => {},
    });
  }

  GetEscuelaEdit(datos: Escuela){
    this.dialog.open(GetEscuelaComponent,{
      disableClose: true,
      width:"600px",
      data: datos
    }).afterClosed().subscribe(resultado => {
      if(resultado === 'Editado'){
        this.cargarEscuelas();
      }
    });
  }



  DeleteEscuela(datos: Escuela){
    this.dialog
      .open(GetEliminarComponent, {
        disableClose: true,
        data: {
          componeteEliminar: 'eliminar escuela',
          tituloAccion: 'Eliminar Escuela',
          datos: datos,
        },
      })
      .afterClosed()
      .subscribe((resultado) => {
        if (resultado === 'Eliminar') {
          this._serviceEscuela.delete(datos.id).subscribe({
            next: (data) => {
              this.MostrarAlerta('Escuela eliminada con éxido', 'Eliminado');
              this.cargarEscuelas();
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
