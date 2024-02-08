import { CommonModule, NgFor } from '@angular/common';
import { AfterViewInit, Component,Inject,OnInit ,ViewChild} from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Universidad } from '@app/models/backend/data-universidad/universidad/universidad';
import { TipoIdentificacion } from '@app/models/backend/datos-principales/tipo-identificacion';
import { TerceroUniversidad } from '@app/models/backend/user/tercero-universidad';
import { UniversidadService } from '@app/services/data-universidad/universidad/universidad.service';
import { TipoIdentificacionService } from '@app/services/datos-principales/tipo-identificacion.service';
import { UserStateService } from '@app/services/login/user-state.service';
import { TerceroUniversidadService } from '@app/services/user/tercero-universidad.service';
import { GetSolicitudUniversidadComponent } from '../get-solicitud-universidad/get-solicitud-universidad.component';
import { GetEliminarComponent } from '@app/shared/controls/get-eliminar/get-eliminar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-solicitud-universidad',
  templateUrl: './solicitud-universidad.component.html',
  styleUrls: ['./solicitud-universidad.component.scss'],
  standalone: true,
  imports: [MatTableModule,MatCardModule,MatIconModule, MatPaginatorModule,FlexLayoutModule,MatFormFieldModule,
    MatButtonModule,
    FormsModule,
    MatInputModule,
    MatDialogModule,
    CommonModule,MatGridListModule,ReactiveFormsModule,MatTooltipModule,NgFor],
})
export class SolicitudUniversidadComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['Codigo', 'Identificacion','Nombre','Acciones'];
  dataSource = new MatTableDataSource<Universidad>();
  idUser : Number = 0;
  idTercero : Number = 0;
  frmGetUsuairo: FormGroup;
  universidades: Universidad[] = [];
  idUniverTer : Number = 0;
  isVinculado: boolean = false;
  TipoIdentificacion:TipoIdentificacion;
  constructor(private serviceUniversidad: UniversidadService,
    private _snackBar: MatSnackBar,
    private terceroUniversidadService: TerceroUniversidadService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public datos: any
    ){
      this.idUser = datos.idUser;
      this.idTercero = datos.idTercero;


  }

  @ViewChild(MatPaginator)  paginator !:MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  CargarUniversidad2(){
    this.universidades = [];
    this.terceroUniversidadService.getByTercero(this.idTercero).subscribe({
      next: (data) => {
        console.log(data);
        for (const universidad of data) {
          this.idUniverTer = universidad.id;
          this.serviceUniversidad.getById(universidad.idUniversidad).subscribe({
            next: (data) => {
              this.universidades.push(data);
            },
            error: (e) => {},
          });
        }
        this.dataSource.data = this.universidades;
      },
      error: (e) => {},
    });
  }

  CargarUniversidad() {
    this.universidades = [];
    this.terceroUniversidadService.getByTercero(this.idTercero).subscribe({
      next: (data) => {
        this.idUniverTer = data[0].id;
        const observables = data.map((universidad) =>
          this.serviceUniversidad.getById(universidad.idUniversidad)
        );

        forkJoin(observables).subscribe({
          next: (universidadesData) => {
            this.universidades = universidadesData;
            this.dataSource.data = this.universidades;
          },
          error: (e) => {
            // Manejar errores de forkJoin
          },
        });
      },
      error: (e) => {
        // Manejar errores de la primera petición
      },
    });
  }

  ngOnInit():void{
    this.CargarUniversidad();
    this.isVinculado = this.dataSource.data.length > 0 ? true:false;
  }



  VerUniveridad(){

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  DeleteSolicitud(datosSolicitud: TerceroUniversidad){
    this.dialog
      .open(GetEliminarComponent, {
        disableClose: true,
        data: {
          componeteEliminar: 'eliminar la solicitud de vinculación',
          tituloAccion: 'Elimnar Solicitud',
          datos: datosSolicitud,
        },
      })
      .afterClosed()
      .subscribe((resultado) => {
        if (resultado === 'Eliminar') {
          this.terceroUniversidadService.delete(this.idUniverTer).subscribe({
            next: (data) => {
              this.MostrarAlerta('Solicitud de vinculación eliminada con éxido', 'Eliminado');
              this.universidades = [];
              this.dataSource.data = this.universidades;
              this.isVinculado = false;
            },
            error: (e) => {},
          });
        }
      });
  }

  MostrarAlerta(message: string, action: string) {
    this._snackBar.open(message, action, {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 4000,
    });
  }

  SolicitarUniversidad(){
    this.dialog.open(GetSolicitudUniversidadComponent,{
      disableClose: true,
      width:"600px",
      data: {id: this.idTercero
          }
    }).afterClosed().subscribe(resultado => {
      if(resultado === 'Creado'){
        this.CargarUniversidad();
        this.isVinculado = true;
      }
    });
  }
}
