import { Component ,OnInit,Inject} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgFor } from '@angular/common';
import { Grupos } from '@app/models/backend/login/grupos';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from '@app/services/user/usuario.service';
import { GruposService } from '@app/services/login/grupos.service';
import { Usuario } from '@app/models/backend/user/usuario';
import { UsuarioGet } from '@app/models/backend/user/usuarioGet';
import { ProgramaService } from '@app/services/data-universidad/universidad/programa.service';
import { Programa } from '@app/models/backend/data-universidad/universidad/programa';
import { Observable, map } from 'rxjs';
import { UserStateService } from '@app/services/login/user-state.service';
import { UsuarioUniversidadService } from '@app/services/user/usuario-universidad.service';

@Component({
  selector: 'app-get-cambiar-programa',
  templateUrl: './get-cambiar-programa.component.html',
  styleUrls: ['./get-cambiar-programa.component.scss'],
  standalone: true,
  imports: [MatGridListModule,MatFormFieldModule
    ,MatDialogModule,MatButtonModule,ReactiveFormsModule
    ,MatInputModule,FormsModule
    ,NgFor,MatOptionModule,MatSelectModule],
})
export class GetCambiarProgramaComponent  implements OnInit {
  frmGetRol: FormGroup;
  ListaProgrmas: Programa[] = [];
  idUser: Number = 0;
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  idUniversidad: Number = 0;

  constructor(private dialogoRefencia: MatDialogRef<GetCambiarProgramaComponent>
    ,private fb: FormBuilder
    ,private _snackBar: MatSnackBar
    ,@Inject(MAT_DIALOG_DATA) public datos: UsuarioGet
    ,private _usuarioService: UsuarioService
    ,private _programaService: ProgramaService
    ,private userStateService: UserStateService
    ,private _serviceUserUni: UsuarioUniversidadService
  ){

    this.cargarProgrmas();

    this.frmGetRol = this.fb.group({
      anterior:[this.datos.nombreRol,Validators.required],
      CodGrupo:['',Validators.required],
    });
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

  cargarProgrmas() {
    if (this.isSuperAdmin) {
      this._programaService.get().subscribe({
        next: (data) => {
          this.ListaProgrmas = data;
        },
        error: (e) => {},
      });
    } else {
      this._serviceUserUni.getByUsuario(this.idUser).subscribe({
        next: (data) => {
          if (data.length > 0) {
            this.idUniversidad = data.at(0).idUniversidad;
            this._programaService.getByUniversidad(this.idUniversidad).subscribe({
              next: (data2) => {
                this.ListaProgrmas = data2;
              },
              error: (e) => {},
            });
          }
        },
        error: (e) => {},
      });
    }
  }

  ngOnInit(): void {

  }

  MostrarAlertar(message: string, action: string) {
    this._snackBar.open(message, action, {
      horizontalPosition:"end",
      verticalPosition:"top",
      duration:4000
    });
  }

  Guardar(){
    const grupo : Number[] = [this.frmGetRol.value.CodGrupo];
    const modelo: UsuarioGet = {
      id:this.datos.id,
      nombreRol:'',
      password:this.datos.password,
      is_superuser:this.datos.is_superuser,
      first_name:this.datos.first_name,
      last_name:this.datos.last_name,
      username:this.datos.username,
      email:this.datos.email,
      phone_number:this.datos.phone_number,
      date_joined: this.datos.date_joined,
      last_login: this.datos.last_login,
      is_admin:this.datos.is_admin,
      is_staff:this.datos.is_staff,
      is_active:this.datos.is_active,
      is_superadmin:this.datos.is_superadmin,
      groups:grupo,
      user_permissions:this.datos.user_permissions
    }

        this._usuarioService.update(this.datos.id,modelo).subscribe({
          next: (data) => {
            this.MostrarAlertar("Programa modificado con éxito","Listo");
            this.dialogoRefencia.close("Editado");
          },error: (e) => {
            this.MostrarAlertar("No se pudo modificado el programa","Error");
          }
        })
  }
}
