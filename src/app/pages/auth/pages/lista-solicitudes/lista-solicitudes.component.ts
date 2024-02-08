import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Solicitud } from '@app/models/backend/solicitudes/solicitud';
import { SolicitudService } from '@app/services/solicitudes/solicitud.service';
import { SolicitudesComponent } from '../solicitudes/solicitudes.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GetEliminarComponent } from '@app/shared/controls/get-eliminar/get-eliminar.component';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { DatePipe , CommonModule} from '@angular/common';
import { SolicitudEfectoEspecificoService } from '@app/services/solicitudes/solicitud-efecto-especifico.service';
import { SolicitudEfectoEspecifico } from '@app/models/backend/solicitudes/solicitud-efecto-especifico';
import { SolicitudEfectoGeneralService } from '@app/services/solicitudes/solicitud-efecto-general.service';
import { SolicitudCausaEspecificaService } from '@app/services/solicitudes/solicitud-causa-especifica.service';
import { SolicitudEfectoGeneral } from '@app/models/backend/solicitudes/solicitud-efecto-general';
import { SolicitudCausaGeneral } from '@app/models/backend/solicitudes/solicitud-causa-general';
import { SolicitudCausaEspecifica } from '@app/models/backend/solicitudes/solicitud-causa-especifica';
import { SolicitudCausaGeneralService } from '@app/services/solicitudes/solicitud-causa-general.service';
import { PalabraClave } from '@app/models/backend/solicitudes/palabra-clave';
import { PalabraClaveService } from '@app/services/solicitudes/palabra-clave.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import {animate, state, style, transition, trigger} from '@angular/animations';
import {NgFor, NgIf} from '@angular/common';
import { Observable, of} from 'rxjs';
import { UserStateService } from '@app/services/login/user-state.service';
import { catchError, map, switchMap } from 'rxjs/operators';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ListaParticipantesComponent } from '../lista-participantes/lista-participantes.component';
import { forkJoin } from 'rxjs';
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
  selector: 'app-lista-solicitudes',
  templateUrl: './lista-solicitudes.component.html',
  styleUrls: ['./lista-solicitudes.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
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
export class ListaSolicitudesComponent implements AfterViewInit, OnInit {
  displayedColumns: String[] = [
    'Código',
    'Estado',
    'Titulo',
    //'Problema',
    'Fecha',
    'TipoApoyo',
    'Nivel',
    'Ubicacion',
    'Departamento',
    'Ciudad',
    'Acciones',
    'expand'
  ];

  getProblemaDetalle(element: Solicitud): String {
    return element.problema;
  }

  expandedElement: Solicitud |  null = null;
  dataSource = new MatTableDataSource<Solicitud>();

  private efectosEspecificos: SolicitudEfectoEspecifico[] = [];
  private efectosGenrales: SolicitudEfectoGeneral[] = [];
  private causasEspecificas: SolicitudCausaEspecifica[] = [];
  private causasGenrales: SolicitudCausaGeneral[] = [];
  private palabrasClaves: PalabraClave[] = [];
  private PalabrasClaves : string = "";
  idUser : Number = 0;
  isAdmin: boolean = false;
  constructor(
    private _solicitudServicio: SolicitudService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _serviceEfectoEsp: SolicitudEfectoEspecificoService,
    private _serviceEfectoGen: SolicitudEfectoGeneralService,
    private _serviceCausaEsp: SolicitudCausaEspecificaService,
    private _serviceCausaGen: SolicitudCausaGeneralService,
    private _servicePalabras : PalabraClaveService,
    private userStateService: UserStateService,
    private _servicePalabra: PalabraClaveService,
    private datePipe: DatePipe
  ) {}


  ngOnInit(): void {
    this.IdUser().subscribe(id => {
      this.idUser = id;
      this.IsAdmin().subscribe(is => {
        this.isAdmin = is;
      });

      this.cargarSolicitudes();
    });

  }



  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  showUpload = false;

  cargarSolicitudes() {
    if(this.isAdmin){
      this._solicitudServicio.get().subscribe({
        next: (data) => {
          this.dataSource.data = data;
        },
        error: (e) => {},
      });
    }else{
      this._solicitudServicio.getByUsuario(this.idUser).subscribe({
        next: (data) => {
          this.dataSource.data = data;
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
        if(userState.isAdmin == false){
          return false;
        }
        return true;
      })
    );
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  GetSolicitud() {
    this._solicitudServicio.get().subscribe({
      next: (data) => {
        const maximo = data.length > 0 ? ( Number(data.reduce((max, item) => item.codigo > max ? item.codigo : max, data[0].codigo)) +1):1;
        const consecutivo = maximo.toString().padStart(8, '0');
        const solicitud: Solicitud = {
          id:null,
          nombreDepartamento:'',
          nombreCiudad:'',
          codigo:consecutivo,
          fecha:new Date(),
          titulo:'',
          problema:'',
          tipoApoyo:'',
          ubicacionGoogle:'',
          estado:'Pendiente',
          nivel: '',
          usuario:0,
          codDepartamento:'',
          codCiudad:''
      }
      this.dialog
      .open(SolicitudesComponent, {
        disableClose: true,
        width: '500px',
        data: solicitud
      })
      .afterClosed().subscribe((resultado) => {
        if (resultado === 'Creado') {
          this.cargarSolicitudes();
        }
      });
    },

      error: (e) => {},
    });

  }

  GetSolicitudEdit(datosSolicitud: Solicitud) {
    this.dialog
      .open(SolicitudesComponent, {
        disableClose: true,
        width: '500px',
        data: datosSolicitud
      })
      .afterClosed()
      .subscribe((resultado) => {
        if (resultado === 'Editado') {
          this.cargarSolicitudes();
        }
      });
  }

  DeleteSolicitud2(datosSolicitud: Solicitud) {
    this.dialog
      .open(GetEliminarComponent, {
        disableClose: true,
        data: {
          componeteEliminar: 'la Solicitud',
          tituloAccion: 'Eliminar Solicitud',
          datos: datosSolicitud,
        },
      })
      .afterClosed()
      .subscribe((resultado) => {
        if (resultado === 'Eliminar') {
          if(this.EliminarPalabras(datosSolicitud.id)){
            this._solicitudServicio.delete(datosSolicitud.id).subscribe({
              next: (data) => {
                this.MostrarAlerta('Solicitud eliminada con éxido', 'Eliminado');
                this.cargarSolicitudes();
              },
              error: (e) => {},
            });
          }
        }
      });
  }

  EliminarPalabras2(id: Number): boolean{
    this._servicePalabra.getByIdSolicitud(id).subscribe({
      next: (data) => {
        this.palabrasClaves = data;
        console.log(this.palabrasClaves)
          for (const palabrai of this.palabrasClaves){
            this._servicePalabra.delete(palabrai.id).subscribe({
              next: (data) => {

              },
              error: (e) => {this.MostrarAlerta('Error al eliminar palabra clave', 'Eliminado');},
            });
          }
        return true
      },
      error: (e) => { return false },
    });
    return true
  }



// ...

DeleteSolicitud(datosSolicitud: Solicitud) {
  this.dialog
    .open(GetEliminarComponent, {
      disableClose: true,
      data: {
        componeteEliminar: 'la Solicitud',
        tituloAccion: 'Eliminar Solicitud',
        datos: datosSolicitud,
      },
    })
    .afterClosed()
    .subscribe((resultado) => {
      if (resultado === 'Eliminar') {
        this.EliminarPalabras(datosSolicitud.id).subscribe((eliminacionExitosa) => {
          if (eliminacionExitosa) {
            this._solicitudServicio.delete(datosSolicitud.id).subscribe({
              next: (data) => {
                this.MostrarAlerta('Solicitud eliminada con éxito', 'Eliminado');
                this.cargarSolicitudes();
              },
              error: (e) => {},
            });
          }
        });
      }
    });
}

EliminarPalabras(id: Number): Observable<boolean> {
  return this._servicePalabra.getByIdSolicitud(id).pipe(
    switchMap((data) => {
      this.palabrasClaves = data;
      const observables = this.palabrasClaves.map((palabrai) =>
        this._servicePalabra.delete(palabrai.id)
      );
      return forkJoin(observables).pipe(
        map(() => true),
        catchError((error) => {
          this.MostrarAlerta('Error al eliminar palabra clave', 'Eliminado');
          return of(false);
        })
      );
    }),
    catchError(() => of(false))
  );
}


  MostrarAlerta(message: string, action: string) {
    this._snackBar.open(message, action, {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 4000,
    });
  }

  getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');

      img.onload = () => {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL('image/png');

        resolve(dataURL);
      };

      img.onerror = (error) => {
        reject(error);
      };

      img.src = url;
    });
  }

  async generarSolicitud(datosSolicitud: Solicitud) {
    // Lista de items asociados por id del elemento
    try {
      this.efectosEspecificos = await this._serviceEfectoEsp.get().toPromise();
      this.efectosGenrales = await this._serviceEfectoGen.getByIdSolicitud(datosSolicitud.id).toPromise();
      this.causasEspecificas = await this._serviceCausaEsp.get().toPromise();
      this.causasGenrales = await this._serviceCausaGen.getByIdSolicitud(datosSolicitud.id).toPromise();
      this.palabrasClaves = await this._servicePalabras.getByIdSolicitud(datosSolicitud.id).toPromise();
    const listaAnidadaCausas = [];

    // Recorrer la lista de elementos
    for (const elemento of this.causasGenrales) {
      // Filtrar los items asociados al elemento actual por su id
      const itemsAsociados = this.causasEspecificas.filter(
        (item) => item.idCausa === elemento.id
      );

      // Crear un subarray que contiene el elemento y sus items asociados
      const subarray = [
        elemento.descripcionCausa +'\n',
        {
          ul: itemsAsociados.map((item) => item.descripcionCausa),
        },'\n',
      ];

      // Agregar el subarray a la lista anidada
      listaAnidadaCausas.push(subarray);
    }

    const listaAnidadaEfectos = [];

    // Recorrer la lista de elementos
    for (const elemento of this.efectosGenrales) {
      // Filtrar los items asociados al elemento actual por su id
      const itemsAsociados = this.efectosEspecificos.filter(
        (item) => item.idEfecto === elemento.id
      );

      // Crear un subarray que contiene el elemento y sus items asociados
      const subarray = [
        elemento.descripcionEfecto + '\n',
        {
          ul: itemsAsociados.map((item) => item.descripcionEfecto),
        },'\n',
      ];

      // Agregar el subarray a la lista anidada
      listaAnidadaEfectos.push(subarray);
    }



    this.PalabrasClaves = "";
    for (const palabra of this.palabrasClaves){
      this.PalabrasClaves +=  palabra.palabra + ', ';
    }
    this.PalabrasClaves = this.PalabrasClaves.substring(0, this.PalabrasClaves.length - 2);
    const fechaFormateada = this.datePipe.transform(datosSolicitud.fecha, 'dd/MM/yyyy');
    const pdfDefinition: any = {
      content: [
        {
          image: await this.getBase64ImageFromURL('assets/unisnu.png'),
          width: 530,
          height: 88,
        },
        {
          text: '\n' + datosSolicitud.titulo,
          style: 'header',
          alignment: 'center',
        },
        {
          alignment: 'justify',
          columns: [
            {
              text: [
                { text: '\nNro. Solicitud: ', bold: true },
                datosSolicitud.codigo,
              ],
              lineHeight: 1.3,
            },
            {
              //text: [{ text: '\nFecha: ', bold: true }, datosSolicitud.fecha],
              text: [{ text: '\nFecha: ', bold: true }, fechaFormateada],
              lineHeight: 1.3,
            },
          ],
        },
        {
          alignment: 'justify',
          columns: [
            {
              text: [
                { text: 'Departamento: ', bold: true },
                datosSolicitud.nombreDepartamento,
                //"BOLIVAR"
              ],
              lineHeight: 1.3,
            },
            {
              text: [
                { text: 'Ciudad: ', bold: true },
                datosSolicitud.nombreCiudad,
                //"CARTAGENA DE INDIAS"
              ],
              lineHeight: 1.3,
            },
          ],
        },
        {
          alignment: 'justify',
          columns: [
            {
              text: [
                { text: 'Tipo de Apoyo: ', bold: true },
                datosSolicitud.tipoApoyo,
              ],
              lineHeight: 1.3,
            },
            {
              text: [
                { text: 'Ubicación: ', bold: true },
                datosSolicitud.ubicacionGoogle,
              ],
              lineHeight: 1.3,
            },
          ],
        },
        {
          text: [{ text: '\nPalabras Claves: ', bold: true }, this.PalabrasClaves ],
          alignment: 'justify',
          lineHeight: 1.3,
        },
        {
          text: [
            { text: 'Descripción del problema: ', bold: true },
            datosSolicitud.problema,
          ],
          alignment: 'justify',
          lineHeight: 1.3,
        },
        {
          text: '\nCausas del problema: ',
          alignment: 'justify',
          lineHeight: 1.3,
          bold: true,
        },
        {
          ul: listaAnidadaCausas,
          lineHeight: 1.3,
        },
        {
          text: '\nEfectos del problema: ',
          alignment: 'justify',
          lineHeight: 1.3,
          bold: true,
        },
        {
          ul: listaAnidadaEfectos,
          lineHeight: 1.3,
        },
      ],
      styles: {
        header: {
          bold: true,
          fontSize: 15,
        },
        superMargin: {
          margin: [20, 0, 40, 0],
          fontSize: 15,
        },
      },
      defaultStyle: {
        fontSize: 12,
      },
    };

    const pdf = pdfMake.createPdf(pdfDefinition);
    pdf.open();
    //pdf.download();
    } catch (error) {
      console.error('Error al cargar los datos:', error);
    }

  }

  isPendiente(item: Solicitud): boolean {
    return item.estado == 'Pendiente' ? false : true ;
  }

}

