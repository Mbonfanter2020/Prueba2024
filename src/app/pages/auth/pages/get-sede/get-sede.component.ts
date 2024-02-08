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
import { Sede } from '@app/models/backend/data-universidad/universidad/sede';
import { Universidad } from '@app/models/backend/data-universidad/universidad/universidad';
import { SedeService } from '@app/services/data-universidad/universidad/sede.service';
import { UniversidadService } from '@app/services/data-universidad/universidad/universidad.service';
import { UsuarioUniversidadService } from '@app/services/user/usuario-universidad.service';
import { Observable, map } from 'rxjs';
import { UserStateService } from '@app/services/login/user-state.service';

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
  selector: 'app-get-sede',
  templateUrl: './get-sede.component.html',
  styleUrls: ['./get-sede.component.scss'],
  providers : [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },DatePipe
  ],
  standalone: true,
  imports: [MatGridListModule,MatFormFieldModule
    ,MatDialogModule,MatButtonModule,ReactiveFormsModule
    ,MatInputModule,FormsModule
    ,NgFor,MatOptionModule,MatSelectModule],
})
export class GetSedeComponent {
  frmGetSede: FormGroup;
  ListaUniversidad: Universidad[] = [];
  idUser : Number = 0;
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  idUniversidad : Number = 0;
  tituloAccion: string = "Nueva Sede";
  botonAccion: string = "Guardar";

  constructor(private dialogoRefencia: MatDialogRef<GetSedeComponent>
    ,private fb: FormBuilder
    ,private _snackBar: MatSnackBar
    ,@Inject(MAT_DIALOG_DATA) public datos: Sede
    ,private _serviceUniversidad: UniversidadService
    ,private _serviceUserUni: UsuarioUniversidadService
    ,private _sedeService: SedeService
    ,private userStateService: UserStateService
    ,private datePipe: DatePipe
  ){

    this.IdUser().subscribe(id => {
      this.idUser = id;
      this.IsAdmin().subscribe(is => {
        this.isAdmin = is;
      });
      this.cargarUniversidades();
    });



    this.frmGetSede = this.fb.group({
      codigo:[this.datos.codigoSede,Validators.required],
      CodUniversidad:['',Validators.required],
      nombre:['',Validators.required],
      direccion:['',Validators.required],
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
        this.isSuperAdmin = userState.isSuperAdmin;
        if(userState.isAdmin == false){
          return false;
        }
        return true;
      })
    );
  }

  cargarUniversidades() {
    if(this.isSuperAdmin){
      this._serviceUniversidad.get().subscribe({
        next: (data) => {
          this.ListaUniversidad= data;
        },
        error: (e) => {},
      });
    }else{
      this._serviceUserUni.getByUsuario(this.idUser).subscribe({
        next: (data) => {
          this.idUniversidad = data.at(0).idUniversidad;
          this._serviceUniversidad.getById(this.idUniversidad).subscribe({
            next: (data2) => {
              const uni: Universidad[] = [];
              uni.push(data2);
              this.ListaUniversidad= uni;
            },
            error: (e) => {},
          });

        },
        error: (e) => {},
      });
    }


  }

  ngOnInit(): void {
    if(this.datos && this.datos.nombre != '' ){
      this.frmGetSede.patchValue({
          id:this.datos.id,
          codigo:this.datos.codigoSede,
          CodUniversidad:this.datos.codigoUniversidad,
          nombre:this.datos.nombre,
          direccion:this.datos.direccion,
      })
      this.botonAccion = "Actualizar";
      this.tituloAccion = "Actualizar Sede";

    }

  }

  MostrarAlertar(message: string, action: string) {
    this._snackBar.open(message, action, {
      horizontalPosition:"end",
      verticalPosition:"top",
      duration:4000
    });
  }

  Guardar(){
    const fechaFormateada = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    const modelo: Sede = {
      id:0,
      codigoSede:this.frmGetSede.value.codigo,
      nombre:this.frmGetSede.value.nombre,
      direccion:this.frmGetSede.value.direccion,
      fechaServidor:fechaFormateada,
      estacion:window.location.hostname,
      codigoUniversidad:this.frmGetSede.value.CodUniversidad,
      usuario:this.idUser
    }

    if(this.datos.nombre == '' ){
      this._sedeService.add(modelo).subscribe({
        next: (data) => {
          this.MostrarAlertar("Solicitud registrada con éxito","Listo");
          this.dialogoRefencia.close("Creado");
        },error: (e) => {
          this.MostrarAlertar("No se pudo registrar la solicitud","Error");
        }
      })


    }else{

      this._sedeService.update(this.datos.id,modelo).subscribe({
        next: (data) => {
          this.MostrarAlertar("Sede modificada con éxito","Listo");
          this.dialogoRefencia.close("Editado");
        },error: (e) => {
          this.MostrarAlertar("No se pudo registrar la sede","Error");
        }
      })

    }
  }

}
