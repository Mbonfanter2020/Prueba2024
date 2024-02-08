import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserEstado } from '@app/models/backend/login/usuario-estado';
import { MenuItem } from '@app/models/backend/menu/MenuItem';
import { Usuario } from '@app/models/backend/user/usuario';
import { RegistrationComponent } from '@app/pages/auth/pages/registration/registration.component';
import { GruposService } from '@app/services/login/grupos.service';
import { UserStateService } from '@app/services/login/user-state.service';
import { TerceroService } from '@app/services/user/tercero.service';
import { UsuarioService } from '@app/services/user/usuario.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() menuToggle = new EventEmitter<void>();
  constructor(private userStateService: UserStateService,
              private _terceroServicio: TerceroService,
              public dialog: MatDialog,
              private router: Router
              ,private serviceGrupo: GruposService) { }
  logueado: boolean = false;
  Nombre  :string = '';
  menuItems: MenuItem[] = [];
  complemento: string = '';
  titiloPagina = 'Research Ecosystem';


  ngOnInit(): void {
    this.Logueado().subscribe(isLogueado => {
      this.logueado = isLogueado;
      if(this.logueado){
        this.NomUsuario().subscribe(nombre => {this.Nombre = nombre});
      }
      this.menuItems = [];
      this.menuItems.push(this.listMenuItems.at(2));
      for (const menu of this.listMenuItems) {
        const inicio: string[] = ['auth/registration','auth/login']
        if(this.logueado){
          if (!this.menuItems.includes(menu) && !inicio.includes(menu.routerLink)) {
            if(menu.routerLink == 'auth/perfil'){
              menu.label = this.Nombre;
            }
            this.menuItems.push(menu);
          }
        }else{
          if (!this.menuItems.includes(menu) && inicio.includes(menu.routerLink)) {
            this.menuItems.push(menu);
          }
        }

      }
    });




  }

  onMenuToggleDispatch(): void{
      this.menuToggle.emit();
  }

  NomUsuario(): Observable<string> {
    return this.userStateService.userState$.pipe(
      map(userState => {
        if (userState.first_name == '') {
          this.titiloPagina = 'Research Ecosystem';
          return '';
        }
        const cero : Number = 0;
        if(userState.idGrupo > cero){
          this.serviceGrupo.getById(userState.idGrupo).subscribe({
            next: (data) => {
              this.titiloPagina =`Research Ecosystem [${data.name}]`;
            },error: (e) => {}
          })
        }

        return userState.username.toString();
      })
    );
  }


  Logueado(): Observable<boolean> {
    return this.userStateService.userState$.pipe(
      map(userState => {
        if (userState.loading === false) {
          return false;
        }
        return true;
      })
    );
  }


  registar: MenuItem = {
      label: 'Registrarse',
      icon: 'person_add',
      routerLink: 'auth/registration',
      showOnMobile: false,
      showOnTablet: false,
      showOnDesktop: true
  }

  cerrar_sesion: MenuItem = {
      label: 'Cerrar Sesión',
      icon: 'rss_feed',
      routerLink: 'auth/Login',
      showOnMobile: false,
      showOnTablet: false,
      showOnDesktop: false
    }

  listMenuItems: MenuItem[] = [
    {
      label: 'Iniciar Sesión',
      icon: 'login',
      routerLink: 'auth/login',
      showOnMobile: false,
      showOnTablet: false,
      showOnDesktop: false
    },
    {
      label: '',
      icon: 'person',
      routerLink: 'auth/perfil',
      showOnMobile: false,
      showOnTablet: false,
      showOnDesktop: true
    },
    {
      label: 'Aceca de nosotros',
      icon: 'info_i',
      routerLink: 'static/acerca-nosotros',
      showOnMobile: false,
      showOnTablet: false,
      showOnDesktop: true
    },
  ];


  GetUsuario() {
    this._terceroServicio.get().subscribe({
      next: (data) => {
        const maximo = data.length > 0 ? (Number(data.reduce((max, item) => item.codigoTercero > max ? item.codigoTercero : max, data[0].codigoTercero)) +1):1 ;
        const consecutivo = maximo.toString().padStart(8, '0');
      this.dialog.open(RegistrationComponent, {
        disableClose: true,
        width: '500px',
        data: consecutivo
      })
      .afterClosed().subscribe((resultado) => {
        if (resultado === 'Creado') {

        }
      });
    },

      error: (e) => {},
    });

  }

  CerrarSesion(){
    localStorage.removeItem('email');
    localStorage.removeItem('clave');

    const userEstado: UserEstado = {
      id:null,
      email: null,
      username : null,
      first_name: null,
      last_name:null,
      phone_number: null,
      loading: false,
      isAdmin:false,
      isSuperAdmin:false,
      idGrupo : 0
    };
    this.userStateService.setUserState(userEstado);
    this.titiloPagina = 'Research Ecosystem';
    this.router.navigate(['auth/login']);
  }

}
