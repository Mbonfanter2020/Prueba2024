import { Component ,Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_FORMATS, MatDateFormats, MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DatePipe, NgFor } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, map } from 'rxjs';
import { UserStateService } from '@app/services/login/user-state.service';
import { Metodologia } from '@app/models/backend/data-universidad/proyecto/metodologia';
import { MetodologiaService } from '@app/services/data-universidad/universidad/metodologia.service';
import { UsuarioUniversidadService } from '@app/services/user/usuario-universidad.service';
import { SolicitudMetodologia } from '@app/models/backend/solicitudes/solicitud-metodologia';
import { SolicitudMetodologiaService } from '@app/services/data-universidad/universidad/solicitud-metodologia.service';
import { TerceroUniversidadService } from '@app/services/user/tercero-universidad.service';
import { UsuarioTerceroService } from '@app/services/login/usuario-tercero.service';
import { TerceroService } from '@app/services/user/tercero.service';
import { Tercero } from '@app/models/backend/user/tercero';
import { UsuarioService } from '@app/services/user/usuario.service';
import { forkJoin } from 'rxjs';
import { TerceroProgramaService } from '@app/services/data-universidad/universidad/tercero-programa.service';
import { isEmpty } from 'lodash';

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
  selector: 'app-get-solicitudes-metodologia',
  templateUrl: './get-solicitudes-metodologia.component.html',
  styleUrls: ['./get-solicitudes-metodologia.component.scss'],
  providers : [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },DatePipe
  ],
  standalone: true,
  imports: [MatGridListModule,MatFormFieldModule
    ,MatDialogModule,MatButtonModule,ReactiveFormsModule
    ,MatInputModule,FormsModule
    ,NgFor,MatOptionModule,MatSelectModule],
})
export class GetSolicitudesMetodologiaComponent {
  idUser : Number = 0;
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  idUniversidad : Number = 0;
  idSolicitud : Number = 0;
  nombreSolicitud: String;
  tituloAccion: string = "Relacionar Metodología";
  botonAccion: string = "Guardar";
  frmGetModalidad: FormGroup;
  ListaMetodologia: Metodologia[] = [];
  ListaTercero: Tercero[] = [];
  codicion:string = '';

  constructor(private dialogoRefencia: MatDialogRef<GetSolicitudesMetodologiaComponent>
    ,private fb: FormBuilder
    ,private _snackBar: MatSnackBar
    ,@Inject(MAT_DIALOG_DATA) public datos: any
    ,private _serviceMetodologia: MetodologiaService
    ,private _serviceUserUni: UsuarioUniversidadService
    ,private _solicitudMetService: SolicitudMetodologiaService
    ,private userStateService: UserStateService
    ,private datePipe: DatePipe
    ,private _serviceUserTer: UsuarioTerceroService
    ,private _serviceTercero: TerceroService
    ,private _servicesUsuario: UsuarioService
    ,private _serviceTerceroPrograma: TerceroProgramaService
  ){
    this.idSolicitud = datos.id
    this.nombreSolicitud = datos.nombre
    this.IdUser().subscribe(id => {
      this.idUser = id;
      this.IsAdmin().subscribe(is => {
        this.isAdmin = is;
      });
      this._serviceUserUni.getByUsuario(this.idUser).subscribe({
        next: (data) => {
          this.idUniversidad = data.at(0).idUniversidad;
          this.cargarMetodologia();
          this.cargarTercero();
        },
        error: (e) => {},
      });

    });



    this.frmGetModalidad = this.fb.group({
      solicitud: [this.nombreSolicitud,Validators.required],
      codMetodologia:['',Validators.required],
      CodEncargado:['',Validators.required],

    });
  }

  cargarMetodologia() {
    if(this.isSuperAdmin){
      this._serviceMetodologia.get().subscribe({
        next: (data) => {
          this.ListaMetodologia= data;
        },
        error: (e) => {},
      });
    }else{
      this._serviceUserUni.getByUsuario(this.idUser).subscribe({
        next: (data) => {
          this.idUniversidad = data.at(0).idUniversidad;
          this._serviceUserUni.getByUniversidad(this.idUniversidad).subscribe({
            next: (users) => {
              this.codicion = '';
              if(users.length > 0){
                for (const us of users) {
                  this.codicion += `&usuario=${us.idUsuario}`
                }
                this.codicion = this.codicion.substring(1);
                this._serviceMetodologia.getByIds(this.codicion).subscribe({
                  next: (data) => {
                    this.ListaMetodologia= data;
                  },
                  error: (e) => {},
                });
              }

            },
            error: (e) => {},
          });

        },
        error: (e) => {},
      });
    }


  }

  cargarTercero() {
    if(this.isSuperAdmin){
      this._serviceTercero.get().subscribe({
        next: (data) => {
          this.ListaTercero = data;
        },
        error: (e) => {},
      });
    }else{
      this._serviceUserUni.getByUniversidad(this.idUniversidad).subscribe({
        next: (users) => {
          this.codicion = '';
          if(users.length > 0) {
            for (const us of users) {
              this.codicion += `&id_usuario=${us.idUsuario}`
            }
            this.codicion = this.codicion.substring(1);
            this._serviceUserTer.getByIdsUser(this.codicion).subscribe({
              next: (data2) => {
                this.codicion = '';

                const observables = [];
                for (const us of data2) {
                  const observable = this._servicesUsuario.getById(us.id_usuario);
                  observables.push(observable);
                }

                forkJoin(observables).subscribe((datausers) => {
                  for (let i = 0; i < data2.length; i++) {
                    const us = data2[i];
                    const datauser = datausers[i];

                    if (datauser.nombreRol == 'Docente') {
                      this.codicion += `&id=${us.id_tercero}`;
                    }
                  }
                  this.codicion = this.codicion.substring(1);

                  if(isEmpty(this.codicion)){
                    this.ListaTercero = [];
                  }else{
                    this._serviceTercero.getByIds(this.codicion).subscribe({
                      next: (data) => {
                        this.ListaTercero = data;
                      },
                      error: (e) => {},
                    });
                  }

                });
              },
              error: (e) => {},
            });
          }

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

  Guardar(){
    this._serviceTerceroPrograma.getByTercero(this.frmGetModalidad.value.CodEncargado).subscribe({
      next: (data) => {
        if(data.length > 0){
          const fechaFormateada = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
        const modelo: SolicitudMetodologia = {
          id:0,
          nombreMetodogia:'',
          identificacionEncargado:'',
          nombreEncargado:'',
          nombreProgramaEnc:'',
          codigoSolicitud: '',
          fechaServidor:fechaFormateada,
          idSolicitud:this.idSolicitud,
          idMetodologia:this.frmGetModalidad.value.codMetodologia,
          idEncargado:this.frmGetModalidad.value.CodEncargado,
          idProgramaEnc:data.at(0).idPrograma,
          usuario:this.idUser
        }

        this._solicitudMetService.add(modelo).subscribe({
          next: (data) => {
            this.MostrarAlertar("Metodología registrada con éxito","Listo");
            this.dialogoRefencia.close("Creado");
          },error: (e) => {
            this.MostrarAlertar("No se pudo registrar la Metodología","Error");
          }
        })
        }else{
          this.MostrarAlertar("El docente no tiene asociado un programa, por favor verifique.","Error");
        }
      },
      error: (e) => {},
    });



  }

  MostrarAlertar(message: string, action: string) {
    this._snackBar.open(message, action, {
      horizontalPosition:"end",
      verticalPosition:"top",
      duration:4000
    });
  }

}
