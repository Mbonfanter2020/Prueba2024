import { NgClass, NgFor,AsyncPipe, DatePipe } from '@angular/common';
import { Component,Inject,OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DATE_FORMATS, MatDateFormats, MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TipoIdentificacion } from '@app/models/backend/datos-principales/tipo-identificacion';
import { Tercero } from '@app/models/backend/user/tercero';
import { Usuario } from '@app/models/backend/user/usuario';
import { UsuarioTercero } from '@app/models/backend/user/usuario-tercero';
import { TipoIdentificacionService } from '@app/services/datos-principales/tipo-identificacion.service';
import { GruposService } from '@app/services/login/grupos.service';
import { UsuarioTerceroService } from '@app/services/login/usuario-tercero.service';
import { TerceroService } from '@app/services/user/tercero.service';
import { UsuarioService } from '@app/services/user/usuario.service';

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
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  providers : [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },DatePipe
  ],
  standalone: true,
  imports: [MatGridListModule,MatFormFieldModule
    ,MatDialogModule,MatButtonModule,ReactiveFormsModule
    ,MatInputModule,MatSelectModule,MatOptionModule,FormsModule
    ,NgFor,NgClass,MatIconModule,MatChipsModule,MatAutocompleteModule,AsyncPipe,FlexLayoutModule,MatTooltipModule
    ],
})
export class RegistrationComponent implements OnInit {
  frmGetUsuairo: FormGroup;
  consecutivo: String;
  fechaIngreso: string;
  listaTipoDocumento: TipoIdentificacion[];
  permisos: Number[] = [];
  grupo: Number;
  idTercero: Number;
  constructor(private dialogoRefencia: MatDialogRef<RegistrationComponent>
              ,private fb: FormBuilder
              ,private _snackBar: MatSnackBar
              ,@Inject(MAT_DIALOG_DATA) public codigo: String
              ,private serviceTercero: TerceroService
              ,private serviceUsuario: UsuarioService
              ,private serviceUsuarioTercero: UsuarioTerceroService
              ,private serviceTipoDocumento: TipoIdentificacionService
              ,private serviceGrupo: GruposService
              ,private datePipe: DatePipe
  )
  {
    this.serviceTipoDocumento.get().subscribe({
      next: (data) => {
        this.listaTipoDocumento = data;
      },error: (e) => {}
    })

    this.serviceGrupo.getByIdNombre('Persona').subscribe({
      next: (data) => {
        this.grupo = data.at(0).id;
      },error: (e) => {}
    })

    this.consecutivo = codigo;
    const fechaActual = new Date();
    this.fechaIngreso = fechaActual.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });

    this.frmGetUsuairo = this.fb.group({
      codigo:[this.consecutivo,Validators.required],
      fechaIngreso:[this.fechaIngreso,Validators.required],
      tipoDoc:['',Validators.required],
      identificacion:['',Validators.required],
      primerNombre:['',Validators.nullValidator],
      SegundoNombre:['',Validators.nullValidator],
      primerApellido:['',Validators.nullValidator],
      SegundoApellido:['',Validators.nullValidator],
      nombre:['',Validators.required],
      usaurio:['',Validators.required],
      correo:['',Validators.required],
      celular:['',Validators.required],
      telefono:['',Validators.nullValidator],
      clave:['',Validators.required],
      clave2:['',Validators.required],
    })
  }
  ngOnInit(): void {

  }

  RegistrarTercero():boolean{
    const fechaFormateada = this.datePipe.transform(new Date, 'yyyy-MM-dd');
    const modeloTer: Tercero = {
      id:0,
      codigoTercero:this.frmGetUsuairo.value.codigo,
      identificacion: this.frmGetUsuairo.value.identificacion,
      nombre: this.frmGetUsuairo.value.nombre,
      primerNombre:this.frmGetUsuairo.value.primerNombre,
      segundoNombre:this.frmGetUsuairo.value.SegundoNombre,
      primerApellido:this.frmGetUsuairo.value.primerApellido,
      segundoApellido:this.frmGetUsuairo.value.SegundoApellido,
      genero:'Por Definir',
      fechaNacimiento:fechaFormateada,
      celular:this.frmGetUsuairo.value.celular,
      telefono:this.frmGetUsuairo.value.celular,
      direccion:'Por Definir',
      email:this.frmGetUsuairo.value.correo,
      estado:true,
      fechaServidor: fechaFormateada,
      TipoIdentificacion:this.frmGetUsuairo.value.tipoDoc
    }

    this.serviceTercero.add(modeloTer).subscribe({
      next: (data) => {
        this.idTercero = data.id;
        return true;
      },error: (e) => {
        this.MostrarAlertar("No se pudo registrar el tercero","Error");
        return false;
      }
    })

    return true;
  }

  registrarUsuario(){

    const modelo: Usuario = {

      id:0,
      nombreRol:'',
      password:this.frmGetUsuairo.value.clave,
      password2:this.frmGetUsuairo.value.clave2,
      is_superuser:false,
      first_name:(this.frmGetUsuairo.value.primerNombre + ' ' +  this.frmGetUsuairo.value.SegundoNombre).trim() === ''
                  ? this.frmGetUsuairo.value.nombre : this.frmGetUsuairo.value.primerNombre + ' ' +  this.frmGetUsuairo.value.SegundoNombre,
      last_name:(this.frmGetUsuairo.value.primerApellido + ' ' +  this.frmGetUsuairo.value.SegundoApellido).trim() === ''
                  ? 'No Aplica' :this.frmGetUsuairo.value.primerApellido + ' ' +  this.frmGetUsuairo.value.SegundoApellido ,
      username:this.frmGetUsuairo.value.usaurio,
      email:this.frmGetUsuairo.value.correo,
      phone_number:this.frmGetUsuairo.value.celular,
      is_admin:false,
      is_staff:false,
      is_active:false,
      is_superadmin:false,
      group_id:this.grupo ,
      user_permissions:this.permisos
    }


    if(this.RegistrarTercero()){
      this.serviceUsuario.add(modelo).subscribe({
        next: (data) => {

          const modelo2: UsuarioTercero = {
            id:0,
            id_tercero: this.idTercero,
            id_usuario: data.id
          }

          this.serviceUsuarioTercero.add(modelo2).subscribe({
            next: (data) => {
              this.MostrarAlertar("Usuario registrada con éxito","Listo");
              this.dialogoRefencia.close("Creado");
            },error: (e) => {
              this.MostrarAlertar("No se pudo registrar el usuario","Error");
            }
          })

        },error: (e) => {
          this.MostrarAlertar("No se pudo registrar el usuario","Error");
        }
      })
    }



  }

  Rellenar(){
    this.frmGetUsuairo.patchValue({ nombre: this.frmGetUsuairo.value.primerNombre + ' ' +  this.frmGetUsuairo.value.SegundoNombre +
      ' '  + this.frmGetUsuairo.value.primerApellido + ' ' +  this.frmGetUsuairo.value.SegundoApellido});
  }

  MostrarAlertar(message: string, action: string) {
    this._snackBar.open(message, action, {
      horizontalPosition:"end",
      verticalPosition:"top",
      duration:4000
    });
  }
}
