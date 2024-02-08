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
import { Sede } from '@app/models/backend/data-universidad/universidad/sede';
import { UniversidadService } from '@app/services/data-universidad/universidad/universidad.service';
import { UserStateService } from '@app/services/login/user-state.service';
import { UsuarioUniversidadService } from '@app/services/user/usuario-universidad.service';
import { GetEliminarComponent } from '@app/shared/controls/get-eliminar/get-eliminar.component';
import { Observable, map } from 'rxjs';
import { GetSedeComponent } from '../get-sede/get-sede.component';
import { SedeService } from '@app/services/data-universidad/universidad/sede.service';
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
  selector: 'app-lista-sedes',
  templateUrl: './lista-sedes.component.html',
  styleUrls: ['./lista-sedes.component.scss'],
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
export class ListaSedesComponent implements AfterViewInit, OnInit  {
  displayedColumns: String[] = [
    'Codigo',
    'Nombre',
    'Direccion',
    'Fecha',
    'Acciones',
  ];


  idUser : Number = 0;
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  sede: Sede
  dataSource = new MatTableDataSource<Sede>();
  idUniversidad : Number = 0;

  constructor(
    public dialog: MatDialog,
    private userStateService: UserStateService,
    private _serviceSede: SedeService,
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
      this.cargarSedes();
    });

  }

  @ViewChild(MatPaginator) paginator!: MatPaginator
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  cargarSedes() {
    if(this.isSuperAdmin){
      this._serviceSede.get().subscribe({
        next: (data) => {
          this.dataSource.data = data;
        },
        error: (e) => {},
      });
    }else{
      this._serviceUserUni.getByUsuario(this.idUser).subscribe({
        next: (data) => {
          this.idUniversidad = data.at(0).idUniversidad;
          this._serviceSede.getByUniversidad(this.idUniversidad).subscribe({
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

  GetSede(){
    this._serviceSede.get().subscribe({
      next: (data) => {
        const maximo = data.length > 0 ? ( Number(data.reduce((max, item) => item.codigoSede > max ? item.codigoSede : max, data[0].codigoSede)) +1):1;
        const consecutivo = maximo.toString().padStart(4, '0');
        const fechaFormateada = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
        const sede: Sede = {
          id:null,
          codigoSede:consecutivo,
          nombre:'',
          direccion:'',
          fechaServidor:fechaFormateada,
          estacion:'',
          codigoUniversidad:0,
          usuario:0
      }
      this.dialog
      .open(GetSedeComponent, {
        disableClose: true,
        width: '500px',
        data: sede
      })
      .afterClosed().subscribe((resultado) => {
        if (resultado === 'Creado') {
          this.cargarSedes();
        }
      });
    },

      error: (e) => {},
    });
  }

  GetSedeEdit(datos: Sede){
    this.dialog.open(GetSedeComponent,{
      disableClose: true,
      width:"600px",
      data: datos
    }).afterClosed().subscribe(resultado => {
      if(resultado === 'Editado'){
        this.cargarSedes();
      }
    });
  }

  DeleteSede(datos: Sede){
    this.dialog
      .open(GetEliminarComponent, {
        disableClose: true,
        data: {
          componeteEliminar: 'eliminar está sede',
          tituloAccion: 'Eliminar Sede',
          datos: datos,
        },
      })
      .afterClosed()
      .subscribe((resultado) => {
        if (resultado === 'Eliminar') {
          this._serviceSede.delete(datos.id).subscribe({
            next: (data) => {
              this.MostrarAlerta('Sede eliminada con éxido', 'Eliminado');
              this.cargarSedes();
            },
            error: (e) => {this.MostrarAlerta('No se pudo eliminar la sede.', 'Eliminado');},
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
