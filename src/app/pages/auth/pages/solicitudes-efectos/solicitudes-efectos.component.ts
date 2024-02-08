import { AfterViewInit, Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule ,MatDialog} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { Solicitud } from '@app/models/backend/solicitudes/solicitud';
import  {SolicitudService} from '@app/services/solicitudes/solicitud.service';
import { SolicitudesComponent } from '../solicitudes/solicitudes.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GetEliminarComponent } from '@app/shared/controls/get-eliminar/get-eliminar.component';
import {  MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { NgFor } from '@angular/common';
import { NgModel } from '@angular/forms';
import { GetCausaEfectoComponent } from '../get-causa-efecto/get-causa-efecto.component';
import { SolicitudEfectoGeneral } from '@app/models/backend/solicitudes/solicitud-efecto-general';
import { SolicitudEfectoEspecifico } from '@app/models/backend/solicitudes/solicitud-efecto-especifico';
import { SolicitudEfectoGeneralService } from '@app/services/solicitudes/solicitud-efecto-general.service';
import { SolicitudEfectoEspecificoService } from '@app/services/solicitudes/solicitud-efecto-especifico.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable, map } from 'rxjs';
import { UserStateService } from '@app/services/login/user-state.service';


@Component({
  selector: 'app-solicitudes-efectos',
  templateUrl: './solicitudes-efectos.component.html',
  styleUrls: ['./solicitudes-efectos.component.scss'],
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule,MatCardModule,MatButtonModule,FlexLayoutModule,FormsModule,MatFormFieldModule
  ,MatInputModule,MatIconModule,MatDialogModule,MatGridListModule,MatSelectModule,MatOptionModule
  ,NgFor,MatTooltipModule]
})
export class SolicitudesEfectosComponent implements OnInit {
  displayedColumns: string[] = ['Id', 'Descripcion','Acciones'];
  dataSource = new MatTableDataSource<SolicitudEfectoGeneral>();
  dataSource2 = new MatTableDataSource<SolicitudEfectoEspecifico>();
  listaSolicitudes: Solicitud[]= [];
  listaEfecto: SolicitudEfectoGeneral[]= [];
  listaEfectoDetalle: SolicitudEfectoEspecifico[]= [];
  idSolicitud:Number = 0;
  idUser : Number = 0;
  isAdmin: boolean = false;
  constructor( private _solicitudServicio: SolicitudService,
    private _solicitudEfectoGeneralSer: SolicitudEfectoGeneralService,
    private _solicitudEfectoEspecificaSer: SolicitudEfectoEspecificoService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private userStateService: UserStateService
    ){
  }

  ngOnInit(): void {
    this.IdUser().subscribe(id => {
      this.idUser = id;
      this.IsAdmin().subscribe(is => {
        this.isAdmin = is;
      });

      this.cargarSolicitudes();
    });

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

  cargarSolicitudes() {
    if(this.isAdmin){
      this._solicitudServicio.get().subscribe({
        next: (data) => {
          this.listaSolicitudes = data;
        },
        error: (e) => {},
      });
    }else{
      this._solicitudServicio.getByUsuario(this.idUser).subscribe({
        next: (data) => {
          this.listaSolicitudes = data;
        },
        error: (e) => {},
      });
    }
  }

  @ViewChild(MatPaginator)  paginator !:MatPaginator;


  selectedRowId: Number = 0;


  onRowFocusOut(rowId: Number){
    this.selectedRowId = rowId;
    console.log(this.selectedRowId);
    this._solicitudEfectoEspecificaSer.getByIdEfecto(this.selectedRowId).subscribe(
      {
        next:(data) => {
          if (data && data.length > 0) {
            this.dataSource2.data = data;

          } else {
            this.dataSource2.data = [];
          }
            this.dataSource2.paginator = this.paginator;
            console.log(data);
        },error:(e) =>{}
      }
    )
  }
  showUpload = false;

  cargarCausas(event: any){
    this._solicitudEfectoGeneralSer.getByIdSolicitud(this.idSolicitud).subscribe(
      {
        next:(data) => {
          if (data && data.length > 0) {
            this.dataSource.data = data;
          } else {
            this.dataSource.data = [];
          }
            this.dataSource.paginator = this.paginator;
        },error:(e) =>{}
      }
    )
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();
  }

  Add(){
    this.dialog.open(GetCausaEfectoComponent,{
      disableClose: true,
      width:"500px",
      data: {tipo:"EG"
            ,tiulo:"Nuevo Efecto General"
            ,titLabel: "Causa General"
            ,nomLabel:"descripcionEfecto"
            ,id: this.idSolicitud
          }
    }).afterClosed().subscribe(resultado => {
      if(resultado === 'Creado'){
        this.cargarCausas(this.idSolicitud);
      }
    });
  }

  AddEsp(){
    this.dialog.open(GetCausaEfectoComponent,{
      disableClose: true,
      width:"500px",
      data: {tipo:"EE"
            ,tiulo:"Nueva Efecto Especifico"
            ,titLabel: "Causa Especifica"
            ,nomLabel:"descripcionEfecto"
            ,id: this.selectedRowId
          }
    }).afterClosed().subscribe(resultado => {
      if(resultado === 'Creado'){
        this.onRowFocusOut(this.selectedRowId);
      }
    });
  }

  Edit(datosFrm: SolicitudEfectoGeneral){
    this.dialog.open(GetCausaEfectoComponent,{
      disableClose: true,
      width:"500px",
      data: {tipo:"EG"
            ,tiulo:"Editar Efecto Directo"
            ,titLabel: "Efecto Especifico"
            ,nomLabel:"descripcionEfecto"
            ,id: this.idSolicitud
            ,formulario:datosFrm
            ,modo:"E"
          }
    }).afterClosed().subscribe(resultado => {
      if(resultado === 'Editado'){
        this.cargarCausas(this.idSolicitud);
      }
    });
  }

  EditEsp(datosFrm: SolicitudEfectoEspecifico){
    this.dialog.open(GetCausaEfectoComponent,{
      disableClose: true,
      width:"500px",
      data: {tipo:"EE"
            ,tiulo:"Editar Efecto Indirecto"
            ,titLabel: "Efecto Especifico"
            ,nomLabel:"descripcionEfecto"
            ,id: this.selectedRowId
            ,formulario:datosFrm
            ,modo:"E"
          }
    }).afterClosed().subscribe(resultado => {
      if(resultado === 'Editado'){
        this.onRowFocusOut(this.selectedRowId);
      }
    });
  }

  Delete(datosCausa: SolicitudEfectoGeneral){
    this.dialog.open(GetEliminarComponent,{
      disableClose: true,
      data: {componeteEliminar:"el Efecto General"
            ,tituloAccion: "Eliminar Effecto General"
            ,datos: datosCausa
          }
    }).afterClosed().subscribe(resultado => {
      if(resultado === 'Eliminar'){
        this._solicitudEfectoGeneralSer.delete(datosCausa.id).subscribe({
          next:(data) =>{
            this.MostrarAlerta("Efecto General eliminado con éxido","Eliminado");
            this.cargarCausas(this.idSolicitud);
          },error: (e) => {}
        })

      }
    });
  }

  DeleteEsp(datosCausaEsp: SolicitudEfectoEspecifico){
    this.dialog.open(GetEliminarComponent,{
      disableClose: true,
      data: {componeteEliminar:"el Efecto Especifico"
            ,tituloAccion: "Eliminar Efecto Especifico"
            ,datos: datosCausaEsp
          }
    }).afterClosed().subscribe(resultado => {
      if(resultado === 'Eliminar'){
        this._solicitudEfectoEspecificaSer.delete(datosCausaEsp.id).subscribe({
          next:(data) =>{
            this.MostrarAlerta("Efecto Especifico eliminada con éxido","Eliminado");
            this.onRowFocusOut(this.selectedRowId);
          },error: (e) => {}
        })

      }
    });
  }

  MostrarAlerta(message: string, action: string) {
    this._snackBar.open(message, action, {
      horizontalPosition:"end",
      verticalPosition:"top",
      duration:4000
    });
  }



}
