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
import { SolicitudCausaGeneral } from '@app/models/backend/solicitudes/solicitud-causa-general';
import { SolicitudCausaEspecifica } from '@app/models/backend/solicitudes/solicitud-causa-especifica';
import { SolicitudCausaGeneralService } from '@app/services/solicitudes/solicitud-causa-general.service';
import { NgModel } from '@angular/forms';
import { GetCausaEfectoComponent } from '../get-causa-efecto/get-causa-efecto.component';
import { SolicitudCausaEspecificaService } from '@app/services/solicitudes/solicitud-causa-especifica.service';
import { UserStateService } from '@app/services/login/user-state.service';
import { map } from 'rxjs/operators';
import { Observable} from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-solicitudes-causas',
  templateUrl: './solicitudes-causas.component.html',
  styleUrls: ['./solicitudes-causas.component.scss'],
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule,MatCardModule,MatButtonModule,FlexLayoutModule,FormsModule,MatFormFieldModule
  ,MatInputModule,MatIconModule,MatDialogModule,MatGridListModule,MatSelectModule,MatOptionModule
  ,NgFor,MatTooltipModule]
})
export class SolicitudesCausasComponent  implements OnInit {
  displayedColumns: string[] = ['Id', 'Descripcion','Acciones'];
  dataSource = new MatTableDataSource<SolicitudCausaGeneral>();
  dataSource2 = new MatTableDataSource<SolicitudCausaEspecifica>();
  listaSolicitudes: Solicitud[]= [];
  listaCausas: SolicitudCausaGeneral[]= [];
  listaCausasDetalle: SolicitudCausaEspecifica[]= [];
  idSolicitud:Number = 0;
  idUser : Number = 0;
  isAdmin: boolean = false;
  constructor( private _solicitudServicio: SolicitudService,
    private _solicitudCausaGeneralSer: SolicitudCausaGeneralService,
    private _solicitudCausaEspecificaSer: SolicitudCausaEspecificaService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private userStateService: UserStateService
    ){

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
      this.IsAdmin().subscribe(is => {
        this.isAdmin = is;
      });

      this.cargarSolicitudes();
    });

  }

  @ViewChild(MatPaginator)  paginator !:MatPaginator;


  selectedRowId: Number = 0;


  onRowFocusOut(rowId: Number){
    this.selectedRowId = rowId;
    console.log(this.selectedRowId);
    this._solicitudCausaEspecificaSer.getByIdCausa(this.selectedRowId).subscribe(
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
    this._solicitudCausaGeneralSer.getByIdSolicitud(this.idSolicitud).subscribe(
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
      data: {tipo:"CG"
            ,tiulo:"Nueva Causa General"
            ,titLabel: "Causa General"
            ,nomLabel:"descripcionCausa"
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
      data: {tipo:"CE"
            ,tiulo:"Nueva Causa Especifica"
            ,titLabel: "Causa Especifica"
            ,nomLabel:"descripcionCausa"
            ,id: this.selectedRowId
          }
    }).afterClosed().subscribe(resultado => {
      if(resultado === 'Creado'){
        this.onRowFocusOut(this.selectedRowId);
      }
    });
  }

  Edit(datosFrm: SolicitudCausaGeneral){
    this.dialog.open(GetCausaEfectoComponent,{
      disableClose: true,
      width:"500px",
      data: {tipo:"CG"
            ,tiulo:"Editar Causa Directa"
            ,titLabel: "Causa Especifica"
            ,nomLabel:"descripcionCausa"
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

  EditEsp(datosFrm: SolicitudCausaEspecifica){
    this.dialog.open(GetCausaEfectoComponent,{
      disableClose: true,
      width:"500px",
      data: {tipo:"CE"
            ,tiulo:"Editar Causa Indirecta"
            ,titLabel: "Causa Especifica"
            ,nomLabel:"descripcionCausa"
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

  Delete(datosCausa: SolicitudCausaGeneral){
    this.dialog.open(GetEliminarComponent,{
      disableClose: true,
      data: {componeteEliminar:"la Causa General"
            ,tituloAccion: "Eliminar Causa General"
            ,datos: datosCausa
          }
    }).afterClosed().subscribe(resultado => {
      if(resultado === 'Eliminar'){
        this._solicitudCausaGeneralSer.delete(datosCausa.id).subscribe({
          next:(data) =>{
            this.MostrarAlerta("Causa General eliminada con éxido","Eliminado");
            this.cargarCausas(this.idSolicitud);
          },error: (e) => {}
        })

      }
    });
  }

  DeleteEsp(datosCausaEsp: SolicitudCausaEspecifica){
    this.dialog.open(GetEliminarComponent,{
      disableClose: true,
      data: {componeteEliminar:"la Causa Especifica"
            ,tituloAccion: "Eliminar Causa Especifica"
            ,datos: datosCausaEsp
          }
    }).afterClosed().subscribe(resultado => {
      if(resultado === 'Eliminar'){
        this._solicitudCausaEspecificaSer.delete(datosCausaEsp.id).subscribe({
          next:(data) =>{
            this.MostrarAlerta("Causa Especifica eliminada con éxido","Eliminado");
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
