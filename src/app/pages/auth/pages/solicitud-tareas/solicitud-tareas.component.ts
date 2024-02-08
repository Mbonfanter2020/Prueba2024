import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
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
import { SolicitudTarea } from '@app/models/backend/data-universidad/proyecto/solicitud-tarea';
import { TareaSolicitudService } from '@app/services/data-universidad/proyecto/tarea-solicitud.service';
import { UserStateService } from '@app/services/login/user-state.service';
import { UsuarioUniversidadService } from '@app/services/user/usuario-universidad.service';
import { GetEliminarComponent } from '@app/shared/controls/get-eliminar/get-eliminar.component';
import { Observable, map } from 'rxjs';
import { ListaDocumentosTareasComponent } from '../lista-documentos-tareas/lista-documentos-tareas.component';
import pdfMake from 'pdfmake/build/pdfmake';
import { PalabraClaveService } from '@app/services/solicitudes/palabra-clave.service';
import { SolicitudCausaGeneralService } from '@app/services/solicitudes/solicitud-causa-general.service';
import { SolicitudCausaEspecificaService } from '@app/services/solicitudes/solicitud-causa-especifica.service';
import { SolicitudEfectoGeneralService } from '@app/services/solicitudes/solicitud-efecto-general.service';
import { SolicitudEfectoEspecificoService } from '@app/services/solicitudes/solicitud-efecto-especifico.service';
import { SolicitudEfectoEspecifico } from '@app/models/backend/solicitudes/solicitud-efecto-especifico';
import { SolicitudEfectoGeneral } from '@app/models/backend/solicitudes/solicitud-efecto-general';
import { SolicitudCausaEspecifica } from '@app/models/backend/solicitudes/solicitud-causa-especifica';
import { SolicitudCausaGeneral } from '@app/models/backend/solicitudes/solicitud-causa-general';
import { PalabraClave } from '@app/models/backend/solicitudes/palabra-clave';
import { Solicitud } from '@app/models/backend/solicitudes/solicitud';
import { MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';
import { SolicitudService } from '@app/services/solicitudes/solicitud.service';
import { UsuarioTerceroService } from '@app/services/login/usuario-tercero.service';

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
  selector: 'app-solicitud-tareas',
  templateUrl: './solicitud-tareas.component.html',
  styleUrls: ['./solicitud-tareas.component.scss'],
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
    FlexLayoutModule,
    MatIconModule,
    MatDialogModule,
    CommonModule,
     NgFor, NgIf,
     MatCardModule,
     MatFormFieldModule,
     MatInputModule,
     MatTooltipModule,
     MatButtonModule
  ],
})

export class SolicitudTareasComponent  implements AfterViewInit, OnInit   {
  displayedColumns: String[] = [
    'Estado',
    'TipoProducto',
    'Producto',
    'NombreMetodologia',
    //'Estudiante',
    'Programa',
    'FechaAsignacion',
    'FechaEntrega',
    'Porcentaje',
    'Acciones',
    'expand'
  ];

  idUser: Number = 0;
  isAdmin: boolean = false;
  getDescripcion(element: SolicitudTarea): String {
    return element.descripcion;
  }
  expandedElement: SolicitudTarea |  null = null;
  dataSource = new MatTableDataSource<SolicitudTarea>();
  codicion: string = '';
  idUniversidad: Number = 0;
  isSuperAdmin: boolean = false;
  private efectosEspecificos: SolicitudEfectoEspecifico[] = [];
  private efectosGenrales: SolicitudEfectoGeneral[] = [];
  private causasEspecificas: SolicitudCausaEspecifica[] = [];
  private causasGenrales: SolicitudCausaGeneral[] = [];
  private palabrasClaves: PalabraClave[] = [];
  private  datosSolicitud : Solicitud;
  private PalabrasClaves : string = "";

  constructor(
    public dialog: MatDialog,
    private userStateService: UserStateService,
    private _solicitudTarea: TareaSolicitudService,
    private _snackBar: MatSnackBar,
    private _serviceUserUni: UsuarioUniversidadService,
    private _serviceEfectoEsp: SolicitudEfectoEspecificoService,
    private _serviceEfectoGen: SolicitudEfectoGeneralService,
    private _serviceCausaEsp: SolicitudCausaEspecificaService,
    private _serviceCausaGen: SolicitudCausaGeneralService,
    private _servicePalabras : PalabraClaveService,
    private _serviceSolicitud: SolicitudService,
    private datePipe: DatePipe,
    private _serviceUsuarioTercero: UsuarioTerceroService
  ) {
  }

  IdUser(): Observable<Number> {
    return this.userStateService.userState$.pipe(
      map((userState) => {
        if (userState.id == null) {
          return 0;
        }
        return userState.id;
      })
    );
  }

  IsAdmin(): Observable<boolean> {
    return this.userStateService.userState$.pipe(
      map((userState) => {
        this.isSuperAdmin = userState.isSuperAdmin;
        if (userState.isAdmin == false) {
          return false;
        }
        return true;
      })
    );
  }

  ngOnInit(): void {
    this.IdUser().subscribe((id) => {
      this.idUser = id;
      this.IsAdmin().subscribe((is) => {
        this.isAdmin = is;
      });
      this.cargarTareas();
    });
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  cargarTareas() {
    this._serviceUsuarioTercero.getByUsuario(this.idUser).subscribe({
      next: (data2) => {
        if(data2.length > 0){
            this._solicitudTarea.getByEstudiante(data2.at(0).id_tercero).subscribe({
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

  TerminarTarea(datos: SolicitudTarea) {
    const estado:string = !datos.cumplido ? 'terminado':'sin terminar';
    const estado2:string = !datos.cumplido ? 'Terminado':'Sin Terminar';
    this.dialog
      .open(GetEliminarComponent, {
        disableClose: true,
        data: {
          componeteEliminar: 'cambiar el estado de está tarea a '+estado,
          tituloAccion: 'Terminar Tarea',
          tituloBoton:estado2,
          datos: datos,
        },
      })
      .afterClosed()
      .subscribe((resultado) => {
        if (resultado === 'Eliminar') {
          const modelo: SolicitudTarea = {
            id: datos.id,
            nombreMetodogia: '',
            codigoSolicitud: '',
            idSolicitud: 0,
            tipoProducto: '',
            producto: '',
            estudiante: '',
            programa: '',
            fechaAsignacion: datos.fechaAsignacion,
            fechaEntrega: datos.fechaEntrega,
            descripcion: datos.descripcion,
            porcentaje: datos.porcentaje,
            cumplido: !datos.cumplido,
            idSolicitudMetodologiaTipoProducto: datos.idSolicitudMetodologiaTipoProducto,
            idEstudiante: datos.idEstudiante,
            idProgramaEst: datos.idProgramaEst,
            idProducto: datos.idProducto,
            usuario: this.idUser,
          };
          this._solicitudTarea.update(datos.id, modelo).subscribe({
            next: (data) => {
              this.MostrarAlerta(
                'Estado de la tarea modificado con éxido',
                'Cambiar Estado'
              );
              this.cargarTareas();
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

  ListarDocumentos(datos: SolicitudTarea){
    this.dialog.open(ListaDocumentosTareasComponent,{
      disableClose: true,
      width:"1600px",
      data: datos.id
    }).afterClosed().subscribe(resultado => {
      if(resultado === 'Creado'){
        this.cargarTareas();
      }
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

  async generarSolicitud(datos: SolicitudTarea) {
    // Lista de items asociados por id del elemento
    try {
       this.datosSolicitud = await this._serviceSolicitud.getById(datos.idSolicitud).toPromise();
      this.efectosEspecificos = await this._serviceEfectoEsp.get().toPromise();
      this.efectosGenrales = await this._serviceEfectoGen.getByIdSolicitud(this.datosSolicitud.id).toPromise();
      this.causasEspecificas = await this._serviceCausaEsp.get().toPromise();
      this.causasGenrales = await this._serviceCausaGen.getByIdSolicitud(this.datosSolicitud.id).toPromise();
      this.palabrasClaves = await this._servicePalabras.getByIdSolicitud(this.datosSolicitud.id).toPromise();
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
    const fechaFormateada = this.datePipe.transform(this.datosSolicitud.fecha, 'dd/MM/yyyy');
    const pdfDefinition: any = {
      content: [
        {
          image: await this.getBase64ImageFromURL('assets/unisnu.png'),
          width: 530,
          height: 88,
        },
        {
          text: '\n' + this.datosSolicitud.titulo,
          style: 'header',
          alignment: 'center',
        },
        {
          alignment: 'justify',
          columns: [
            {
              text: [
                { text: '\nNro. Solicitud: ', bold: true },
                this.datosSolicitud.codigo,
              ],
              lineHeight: 1.3,
            },
            {
              //text: [{ text: '\nFecha: ', bold: true }, this.datosSolicitud.fecha],
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
                this.datosSolicitud.nombreDepartamento,
                //"BOLIVAR"
              ],
              lineHeight: 1.3,
            },
            {
              text: [
                { text: 'Ciudad: ', bold: true },
                this.datosSolicitud.nombreCiudad,
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
                this.datosSolicitud.tipoApoyo,
              ],
              lineHeight: 1.3,
            },
            {
              text: [
                { text: 'Ubicación: ', bold: true },
                this.datosSolicitud.ubicacionGoogle,
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
            this.datosSolicitud.problema,
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

  MostrarAlerta(message: string, action: string) {
    this._snackBar.open(message, action, {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 4000,
    });
  }
}
