
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Usuario } from '@app/models/backend/user/usuario';
import { UserStateService } from '@app/services/login/user-state.service';
import { UsuarioService } from '@app/services/user/usuario.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, map } from 'rxjs';
import { GetEliminarComponent } from '@app/shared/controls/get-eliminar/get-eliminar.component';
import { UsuarioGet } from '@app/models/backend/user/usuarioGet';
import { UsuarioUniversidadService } from '@app/services/user/usuario-universidad.service';
import { GetCambiarRolComponent } from '../get-cambiar-rol/get-cambiar-rol.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { TerceroUniversidadService } from '@app/services/user/tercero-universidad.service';
import { UsuarioTerceroService } from '@app/services/login/usuario-tercero.service';
import { UsuarioUniversidad } from '@app/models/backend/user/usuario-universidad';
import { GetCambiarProgramaComponent } from '../get-cambiar-programa/get-cambiar-programa.component';

interface Estado {
  value: string;
  nombre: string;
}


@Component({
  selector: 'app-permisos',
  templateUrl: './permisos.component.html',
  styleUrls: ['./permisos.component.scss'],
  standalone: true,
  imports: [ MatTableModule,
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
     MatTooltipModule,MatGridListModule,MatOptionModule,MatSelectModule],
})
export class PermisosComponent implements AfterViewInit, OnInit {

  displayedColumns: String[] = [
    'Estado',
    'Usuario',
    'Nombre',
    'Rol',
    'Correo',
    'Telefono',
    'FechaIngreso',
    'Acciones',
  ];


  idUser : Number = 0;
  idUniversidad : Number = 0;
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  usuario: UsuarioGet
  dataSource = new MatTableDataSource<UsuarioGet>();
  codicion:string = '';
  estado : string = '1';
  accionElimminar : string = 'Desactivar Usuario';
  accionVincular : string = 'Activar Usuario';
  opciones: Estado[] = [
    {value: '1', nombre: 'Asociados'},
    {value: '2', nombre: 'Pendientes de vinculación'},

  ];
  constructor(public dialog: MatDialog,
    private userStateService: UserStateService,
    private _serviceUsuario: UsuarioService,
    private _snackBar: MatSnackBar,
    private _serviceUserUni: UsuarioUniversidadService,
    private _serviceTerUni: TerceroUniversidadService,
    private _serviceUserTer: UsuarioTerceroService
  ) {

  }

  CambioConsulta(event: any){

    if(this.estado == '1')
    {
      this.accionElimminar = 'Desactivar Usuario';
      this.accionVincular = 'Activar Usuario';
      this.cargarUsuario();
    }else{
      this.accionElimminar = 'Eliminar Usuario';
      this.accionVincular = 'Aceptar Vinculación';
      this.CargarPendientes();
    }

  }

  CargarPendientes(){
    this.dataSource.data = [];
    if(this.isAdmin && !this.isSuperAdmin){
      this._serviceTerUni.getByUniversidad(this.idUniversidad).subscribe({
        next: (users) => {
          this.codicion = '';
          if(users.length > 0) {
            for (const us of users) {
              this.codicion += `&id_tercero=${us.idTercero}`
            }
            this.codicion = this.codicion .substring(1);
            this._serviceUserTer.getByIds(this.codicion).subscribe({
              next: (data2) => {
                this.codicion = '';
                for (const us of data2) {
                  this.codicion += `&id=${us.id_usuario}`
                }
                this.codicion = this.codicion .substring(1);
                this._serviceUsuario.getByIds(this.codicion).subscribe({
                  next: (data) => {
                    this.dataSource.data = data;
                  },
                  error: (e) => {},
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

  ngOnInit(): void {
    this.IdUser().subscribe(id => {
      this.idUser = id;
      this.IsAdmin().subscribe(is => {
        this.isAdmin = is;
      });
      this.cargarUsuario();
    });

  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  cargarUsuario() {
    this.dataSource.data = [];
    if(this.isSuperAdmin){
      this._serviceUsuario.get().subscribe({
        next: (data) => {
          this.dataSource.data = data;
        },
        error: (e) => {},
      });

    }


    if(this.isAdmin && !this.isSuperAdmin){
      this._serviceUserUni.getByUsuario(this.idUser).subscribe({
        next: (data) => {
          this.idUniversidad = data.at(0).idUniversidad;
          this._serviceUserUni.getByUniversidad(this.idUniversidad).subscribe({
            next: (users) => {
              this.codicion = '';
              if(users.length > 0){
                for (const us of users) {
                  this.codicion += `&id=${us.idUsuario}`
                }
                this.codicion = this.codicion .substring(1);
                this._serviceUsuario.getByIds(this.codicion).subscribe({
                  next: (data) => {
                    this.dataSource.data = data;
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

  DeleteUsuario(datos: UsuarioGet){
    this.dialog
      .open(GetEliminarComponent, {
        disableClose: true,
        data: {
          componeteEliminar: this.estado == '1' ? 'desactivar usuario' :'eliminar usuario' ,
          tituloAccion: this.estado == '1' ? 'Desactivar Usuario':'Eliminar usuario',
          tituloBoton: this.estado == '1' ? 'Desactivar' : 'Elimnar',
          datos: datos,
        },
      })
      .afterClosed()
      .subscribe((resultado) => {
        if (resultado === 'Eliminar') {
          if(this.estado == '1' ){
            this.Vnculacion(false,datos);
          }else{
            this._serviceUserTer.getByUsuario(datos.id).subscribe({
              next: (data) => {
                const eliminar: EliminarUniversidaTercero = {
                  idTercero: data.at(0).id_tercero
                }
                this._serviceTerUni.deleteByTercero(eliminar).subscribe({
                  next: (data) => {
                    this.MostrarAlerta("Usuario eliminado con éxito","Listo");
                    this.CargarPendientes();
                  },error: (e) => {
                    this.MostrarAlerta("No se pudo eliminado el usaurio","Error");
                  }
                })
              },error: (e) => {
                this.MostrarAlerta("No se pudo eliminar  el usaurio","Error");
              }
            })

          }


        }
      });
  }


  Vnculacion(estado:boolean, datos: UsuarioGet){
    const modelo: UsuarioGet = {
      id:datos.id,
      nombreRol:'',
      password:datos.password,
      is_superuser:datos.is_superuser,
      first_name:datos.first_name,
      last_name:datos.last_name,
      username:datos.username,
      email:datos.email,
      phone_number:datos.phone_number,
      date_joined: datos.date_joined,
      last_login: datos.last_login,
      is_admin:datos.is_admin,
      is_staff:datos.is_staff,
      is_active:estado,
      is_superadmin:datos.is_superadmin,
      groups:datos.groups,
      user_permissions:datos.user_permissions
    }

        this._serviceUsuario.update(datos.id,modelo).subscribe({
          next: (data) => {
            this.MostrarAlerta(estado ? "Usuario activado con éxito": "Usuario desactivado con éxito","Listo");
            this.cargarUsuario();
          },error: (e) => {
            this.MostrarAlerta(estado ? "No se pudo activar el usaurio" : "No se pudo desactivar el usaurio","Error");
          }
        })
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

  GetAsignarRol(usuario: UsuarioGet){
    this.dialog.open(GetCambiarRolComponent,{
      disableClose: true,
      width:"400px",
      data: usuario
    }).afterClosed().subscribe(resultado => {
      if(resultado === 'Editado'){
        this.cargarUsuario();

      }
    });
  }

  GetAsignarPrograma(usuario: UsuarioGet){
    this.dialog.open(GetCambiarProgramaComponent,{
      disableClose: true,
      width:"400px",
      data: usuario
    }).afterClosed().subscribe(resultado => {
      if(resultado === 'Editado'){
        this.cargarUsuario();

      }
    });
  }

  AceptarUsuario(usuario: UsuarioGet){
    this.dialog
      .open(GetEliminarComponent, {
        disableClose: true,
        data: {
          componeteEliminar:this.estado == '1' ? 'activar este usuario': 'vincular este usuario' ,
          tituloAccion: this.estado == '1' ? 'Activar Usuario': 'Vincular usuario',
          tituloBoton: this.estado == '1' ? 'Activar': 'Vicnular',
          datos: usuario
        },
      })
      .afterClosed()
      .subscribe((resultado) => {
        if (resultado === 'Eliminar') {
          if(this.estado == '1'){
            this.Vnculacion(true,usuario);
          }else{
            const modelo : UsuarioUniversidad ={
              id:0,
              idUsuario: usuario.id,
              idUniversidad: this.idUniversidad

            }
            this._serviceUserUni.add(modelo).subscribe({
              next: (data) => {
                this._serviceUserTer.getByUsuario(usuario.id).subscribe({
                  next: (data2) => {
                    const eliminar: EliminarUniversidaTercero = {
                      idTercero: data2.at(0).id_tercero
                    }
                    this._serviceTerUni.deleteByTercero(eliminar).subscribe({
                    next: (data3) => {
                      this.MostrarAlerta("Usuario vinculado con éxito","Listo");
                      this.CargarPendientes();
                  },error: (e) => {
                    this.MostrarAlerta("No se pudo vincular el usaurio","Error");
                  }
                })
                  },error: (e) => {
                    this.MostrarAlerta("No se pudo vincular el usaurio","Error");
                  }
                })

              },error: (e) => {
                this.MostrarAlerta("No se pudo vincular el usaurio","Error");
              }
            })
          }

        }
      });

  }

  isActivo(item: UsuarioGet): boolean {
    if(this.estado == '1'){
      return item.is_active;
    }else{
      return false;
    }

  }

  isActivo2(item: UsuarioGet): boolean {
    if(this.estado == '1'){
      return item.is_active;
    }else{
      return false;
    }

  }

  isActivo3(item: UsuarioGet): boolean {
    if(this.estado == '1'){
      return item.is_active;
    }else{
      return true;
    }

  }


}

interface EliminarUniversidaTercero {
  idTercero: Number;
}
