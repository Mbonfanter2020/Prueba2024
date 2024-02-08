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

@Component({
  selector: 'app-get-cambiar-rol',
  templateUrl: './get-cambiar-rol.component.html',
  styleUrls: ['./get-cambiar-rol.component.scss'],
  standalone: true,
  imports: [MatGridListModule,MatFormFieldModule
    ,MatDialogModule,MatButtonModule,ReactiveFormsModule
    ,MatInputModule,FormsModule
    ,NgFor,MatOptionModule,MatSelectModule],
})
export class GetCambiarRolComponent implements OnInit {
  frmGetRol: FormGroup;
  ListaGrupos: Grupos[] = [];

  constructor(private dialogoRefencia: MatDialogRef<GetCambiarRolComponent>
    ,private fb: FormBuilder
    ,private _snackBar: MatSnackBar
    ,@Inject(MAT_DIALOG_DATA) public datos: UsuarioGet
    ,private _usuarioService: UsuarioService
    ,private _grupoService: GruposService
  ){

    this._grupoService.get().subscribe({
      next: (data) => {
        this.ListaGrupos = data.filter(grupo => grupo.name !== 'Administrador'); ;

      },error: (e) => {}
    })

    this.frmGetRol = this.fb.group({
      anterior:[this.datos.nombreRol,Validators.required],
      CodGrupo:['',Validators.required],
    });
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
            this.MostrarAlertar("Rol modificado con éxito","Listo");
            this.dialogoRefencia.close("Editado");
          },error: (e) => {
            this.MostrarAlertar("No se pudo modificado el rol","Error");
          }
        })
  }
}
