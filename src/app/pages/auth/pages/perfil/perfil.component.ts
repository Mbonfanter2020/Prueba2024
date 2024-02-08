import { CommonModule, NgFor } from '@angular/common';
import { AfterViewInit, Component,OnInit ,ViewChild} from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Universidad } from '@app/models/backend/data-universidad/universidad/universidad';
import { TipoIdentificacion } from '@app/models/backend/datos-principales/tipo-identificacion';
import { Tercero } from '@app/models/backend/user/tercero';
import { UsuarioTercero } from '@app/models/backend/user/usuario-tercero';
import { UniversidadService } from '@app/services/data-universidad/universidad/universidad.service';
import { TipoIdentificacionService } from '@app/services/datos-principales/tipo-identificacion.service';
import { UserStateService } from '@app/services/login/user-state.service';
import { UsuarioTerceroService } from '@app/services/login/usuario-tercero.service';
import { TerceroService } from '@app/services/user/tercero.service';
import { Observable, map } from 'rxjs';
import { SolicitudUniversidadComponent } from '../solicitud-universidad/solicitud-universidad.component';
import { UsuarioUniversidadService } from '@app/services/user/usuario-universidad.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  standalone: true,
  imports: [MatTableModule,MatCardModule,MatIconModule, MatPaginatorModule,FlexLayoutModule,MatFormFieldModule,
    MatButtonModule,
    FormsModule,
    MatInputModule,
    MatDialogModule,
    CommonModule,MatGridListModule,ReactiveFormsModule,MatTooltipModule,NgFor],
})
export class PerfilComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['Codigo', 'Identificacion','Nombre','Acciones'];
  dataSource = new MatTableDataSource<Universidad>();
  idUser : Number = 0;
  idTercero : Number = 0;
  frmGetUsuairo: FormGroup;
  labelNombre: String = 'Nombre Completo:';
  labelFechaNac: string = 'Fecha Nacimiento:';
  universidades: Universidad[] = [];
  isVinculado: boolean = false;

  Tercero:Tercero = {
    id: 0,
    codigoTercero: '',
    identificacion: '',
    nombre: '',
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    genero: '',
    fechaNacimiento: '',
    celular: '',
    telefono: '',
    direccion: '',
    email: '',
    estado: false,
    fechaServidor: '',
    TipoIdentificacion: 0
  };

  TipoIdentificacion:TipoIdentificacion = {
    id:0,
    codigoIdentificacion:'',
    nombre: ''
  };
  constructor(private serviceUniversidad: UniversidadService,
    private userStateService: UserStateService,
    private terceroService: TerceroService,
    private terceroUsuarioService: UsuarioTerceroService,
    private tipoIdentificacionService: TipoIdentificacionService,
    private usuarioUniversidadService: UsuarioUniversidadService,
    public dialog: MatDialog){

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



  @ViewChild(MatPaginator)  paginator !:MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


 CargaUniversidades() {
  this.usuarioUniversidadService.getByUsuario(this.idUser).subscribe({
    next: (data) => {
      const observables = data.map((universidad) =>
        this.serviceUniversidad.getById(universidad.idUniversidad)
      );

      forkJoin(observables).subscribe({
        next: (universidadesData) => {
          this.universidades = universidadesData;
          this.dataSource.data = this.universidades;
          this.isVinculado = this.universidades.length > 0 ? true:false;
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
  this.IdUser().subscribe(id => {
    this.idUser = id;
    if (this.idUser != null){
      this.terceroUsuarioService.getByUsuario(this.idUser).subscribe({
        next: (datos) => {
          this.idTercero = datos.length > 0 ? datos.at(0).id_tercero : 0;
          if(datos.length > 0){
            this.terceroService.getById(this.idTercero).subscribe({
              next: (dataTer) => {
                this.Tercero = dataTer;
                this.tipoIdentificacionService.getById(this.Tercero.TipoIdentificacion).subscribe({
                  next: (data) => {
                    this.TipoIdentificacion = data;
                    if(this.TipoIdentificacion.codigoIdentificacion == 'NIT'){
                      this.labelFechaNac = 'Fecha Fundación:';
                      this.labelNombre = 'Razón Social:';
                    }else{
                      this.labelNombre = 'Nombre Completo:';
                      this.labelFechaNac = 'Fecha Nacimiento:';
                    }
                  },
                  error: (e) => {},
                });
              },
              error: (e) => {},
            });
          }

        },
        error: (e) => {console.log('error' ) },
      });

      this.CargaUniversidades();


    }else{
      console.log("sin consultar")
    }

  });
}

  VerUniveridad(){

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  SolicitarUniversidad(){
    this.dialog
      .open(SolicitudUniversidadComponent, {
        disableClose: true,
        width: '700px',
        data: {
          idUser: this.idUser,
          idTercero:this.idTercero,
        },
      })
      .afterClosed()
      .subscribe((resultado) => {
        if (resultado === 'Editado') {
          this.CargaUniversidades();
        }
      });
  }
}
