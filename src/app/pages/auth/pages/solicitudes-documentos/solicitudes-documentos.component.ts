
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {  MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UniversidadService } from '@app/services/data-universidad/universidad/universidad.service';
import { UserStateService } from '@app/services/login/user-state.service';
import { UsuarioUniversidadService } from '@app/services/user/usuario-universidad.service';
import { GetEliminarComponent } from '@app/shared/controls/get-eliminar/get-eliminar.component';
import { Observable, map } from 'rxjs';
import { MAT_DATE_FORMATS, MatDateFormats, MatOptionModule } from '@angular/material/core';
import {  PopupsModule } from '@app/shared';
import { SolicitudDocumento } from '@app/models/backend/solicitudes/solicitud-documento';
import { SolicitudDocumentoService } from '@app/services/solicitudes/solicitud-documento.service';
import { Solicitud } from '@app/models/backend/solicitudes/solicitud';
import { SolicitudService } from '@app/services/solicitudes/solicitud.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';

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
  selector: 'app-solicitudes-documentos',
  templateUrl: './solicitudes-documentos.component.html',
  styleUrls: ['./solicitudes-documentos.component.scss'],
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
     MatTooltipModule,
     //IndicatorsModule,
    PopupsModule,
    MatGridListModule,
    MatOptionModule,
    MatSelectModule
  ],
})

export class SolicitudesDocumentosComponent implements AfterViewInit, OnInit  {
  showUpload = false;
  displayedColumns: String[] = [
    'TipoArchivo',
    'NombreArchivo',
    'Archivo',
    'Acciones',
  ];


  idUser : Number = 0;
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  dataSource = new MatTableDataSource<SolicitudDocumento>();
  listaSolicitudes: Solicitud[]= [];
  idSolicitud:Number = 0;

  constructor(
    public dialog: MatDialog,
    private userStateService: UserStateService,
    private _serviceUniversidad: UniversidadService,
    private _serviceDocumento: SolicitudDocumentoService,
    private _snackBar: MatSnackBar,
    private _serviceUserUni: UsuarioUniversidadService,
    private datePipe: DatePipe,
    private _solicitudServicio: SolicitudService,
  ) {

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
      this.cargarSolicitudes();
    });

  }

  @ViewChild(MatPaginator) paginator!: MatPaginator
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  cargarArchivos() {
    if(this.isSuperAdmin){
      this._serviceDocumento.get().subscribe({
        next: (data) => {
          this.dataSource.data = data;
        },
        error: (e) => {},
      });
    }else{
      this._serviceUserUni.getByUsuario(this.idUser).subscribe({
        next: (data) => {
          this._serviceDocumento.get().subscribe({
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

  onToggleUpload():void{
    this.showUpload = !this.showUpload;
  }

  onFilesChanged(urls: string | string[]) : void {
    if (typeof urls === 'string') {
      this.detectarTipoYNombreArchivo(urls);
    } else if (Array.isArray(urls)) {
      for (const url of urls) {
        this.detectarTipoYNombreArchivo(url);
      }
    } else {
      console.error('Formato no válido para las URL.');
    }
  }

  detectarTipoYNombreArchivo(url: string): void {
    const urlObj = new URL(url);
    const nombreArchivoConPath = decodeURIComponent(urlObj.pathname.split('/').pop());
    const nombreArchivoSinPath = this.quitarPartePath(nombreArchivoConPath);

    // Obtener la extensión del archivo
    const extensionArchivo = nombreArchivoSinPath.split('.').pop();

    // Determinar el tipo de archivo basándote en la extensión
    const tipoArchivo = this.obtenerTipoArchivo(extensionArchivo);

    const fechaFormateada = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    const modelo: SolicitudDocumento= {
      id: 0,
      tipoArchivo: tipoArchivo,
      nombreArchivo:nombreArchivoSinPath,
      archivo: url,
      idSolicitud: this.idSolicitud,
      fechaServidor: fechaFormateada,
      usuario: this.idUser,
    };
    this._serviceDocumento.add(modelo).subscribe({
      next: (data) => {
        this.MostrarAlerta('Documentos registrado(s) con éxito', 'Listo');
        this.cargarArchivos();
      },
      error: (e) => {
        this.MostrarAlerta('No se pudo registrar los documentos', 'Error');
      },
    });

  }

  quitarPartePath(nombreArchivoConPath: string): string {
    const partes = nombreArchivoConPath.split('/');
    return partes[1]; // Suponiendo que siempre es el segundo segmento después de '/'
  }

  obtenerTipoArchivo(extensionArchivo: string): string {
    // Mapear extensiones a tipos de archivo conocidos
    const extensionesImagen = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
    const extensionesVideo = ['mp4', 'avi', 'mkv', 'mov', 'wmv'];
    const extensionesPDF = ['pdf'];

    if (extensionesImagen.includes(extensionArchivo.toLowerCase())) {
      return 'Imagen';
    } else if (extensionesVideo.includes(extensionArchivo.toLowerCase())) {
      return 'Video';
    } else if (extensionesPDF.includes(extensionArchivo.toLowerCase())) {
      return 'PDF';
    } else {
      return 'Tipo Desconocido';
    }
  }

  VerArchivo(datos: SolicitudDocumento){
    window.open(datos.archivo+'', '_blank');
  }

  EimnarArchivo(datos: SolicitudDocumento){
    this.dialog
      .open(GetEliminarComponent, {
        disableClose: true,
        data: {
          componeteEliminar: 'eliminar documento',
          tituloAccion: 'Eliminar Documento',
          datos: datos,
        },
      })
      .afterClosed()
      .subscribe((resultado) => {
        if (resultado === 'Eliminar') {
          this._serviceDocumento.delete(datos.id).subscribe({
            next: (data) => {
              this.MostrarAlerta('documento eliminado con éxido', 'Eliminado');
              this.cargarArchivos();
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
