import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '@app/services';
import * as fromRoot from '@app/store';
import * as fromUser from '@app/store/user';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UserStateService } from './services/login/user-state.service';
import { map } from 'rxjs/operators';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
} from 'ng-apexcharts';
import { SolicitudEstadoService } from './services/data-universidad/universidad/solicitud-estado.service';
import { SolicitudEstado } from './models/backend/data-universidad/proyecto/solicitud-estado';
import { UsuarioUniversidadService } from './services/user/usuario-universidad.service';
import { SolicitudTipoApoyo } from './models/backend/data-universidad/proyecto/solicitud-tipo-apoyo';
import { SolicitudNivel } from './models/backend/data-universidad/proyecto/solicitud-nivel';
import { GruposService } from './services/login/grupos.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  showSpinner = true;
  title = 'proyecto-inv-front';
  logueado: boolean = false;
  fondo: boolean = false;
  IsAdmin: boolean = false;
  textoBoton: string = 'Iniciar Sesión';
  url: string = '/assets/fondo.jpg';
  chartTipoApoyo: ChartOptions;
  chartTipoNivel: ChartOptions;
  modeloEstados: SolicitudEstado = {
    Asignada: 0,
    Rechazada: 0,
    Pendiente: 0,
    Terminada: 0,
    EnProceso: 0
  };

  modeloTipoApoyo: SolicitudTipoApoyo = {
    Investigacion: 0,
    Proyeccion: 0
  };

  modeloNivel: SolicitudNivel = {
    Individual:0,
    Familiar:0,
    Comunidad:0,
    Territorio:0
  }

  idUniversidad: Number = 0;
  idUser: Number = 0;
  idGrupo: Number = 0;
  codicion: string = '';
  isSuperAdmin: boolean = false;
  nombreGrupo: string;
  constructor(
    private notification: NotificationService,
    private router: Router,
    private store: Store<fromRoot.State>,
    private userStateService: UserStateService,
    private serviceEstadoSol: SolicitudEstadoService,
    private _serviceUserUni: UsuarioUniversidadService,
    private _serivceGrupo: GruposService
  ) {
    this.Logueado().subscribe((isLogueado) => {
      this.logueado = isLogueado;
      this._serivceGrupo.getById(this.idGrupo).subscribe({
        next: (data) => {
          this.nombreGrupo = data.name + '';
        },
        error: (e) => {},
      });
      this.ObtenerEstadosSolicitudes();
    });

  }

  MostarHome(): boolean {
    if(!['/static/welcome'].includes(this.router.url)){
      return false;
    }else{
      if(['Persona','Estudiante'].includes(this.nombreGrupo)){
        return false;
      }else{
        return true;
      }
    }
  }

  PrepararGraficos() {
    this.chartTipoApoyo = {
      series: [
        {
          name: 'SolicitudesTipoApoyo',
          data: [this.modeloTipoApoyo.Proyeccion, this.modeloTipoApoyo.Investigacion],
        },
      ],
      chart: {
        height: 250,
        width: 460,
        type: 'bar',
      },
      title: {
        text: 'Solicitudes por tipo de apoyo',
      },
      xaxis: {
        categories: ['Proyección Social', 'Investigación'],
      },
    };

    this.chartTipoNivel = {
      series: [
        {
          name: 'SolicitudesNivel',
          data: [this.modeloNivel.Individual, this.modeloNivel.Familiar, this.modeloNivel.Comunidad, this.modeloNivel.Territorio],
        },
      ],
      chart: {
        height: 250,
        width: 700,
        type: 'bar',
      },
      title: {
        text: 'Solicitudes por nivel de problema',
      },
      xaxis: {
        categories: ['Individual', 'Familiar', 'Comunidad', 'Territorio'],
      },
    };
  }

  ObtenerEstadosSolicitudes() {
    if (!this.isSuperAdmin && this.idUser) {
      this._serviceUserUni.getByUsuario(this.idUser).subscribe({
        next: (data) => {
          if (data.length > 0) {
            this.idUniversidad = data.at(0).idUniversidad;
            this._serviceUserUni
              .getByUniversidad(this.idUniversidad)
              .subscribe({
                next: (users) => {
                  this.codicion = '';
                  if (users.length > 0) {
                    for (const us of users) {
                      this.codicion += `&usuario=${us.idUsuario}`;
                    }
                    this.codicion = this.codicion.substring(1);
                    this.serviceEstadoSol.get(this.codicion).subscribe({
                      next: (data) => {
                        this.modeloEstados = data;
                        this.PrepararGraficos();
                      },
                      error: (e) => {},
                    });

                    this.serviceEstadoSol.getByTipoApoyo(this.codicion).subscribe({
                      next: (data) => {
                        this.modeloTipoApoyo = data;
                        this.PrepararGraficos();
                      },
                      error: (e) => {},
                    });

                    this.serviceEstadoSol.getByNivel(this.codicion).subscribe({
                      next: (data) => {
                        this.modeloNivel= data;
                        this.PrepararGraficos();
                      },
                      error: (e) => {},
                    });


                  }
                },
                error: (e) => {},
              });
          }
        },
        error: (e) => {},
      });
    }else{
      this.PrepararGraficos();
    }
  }

  ngOnInit() {
    this.Logueado().subscribe((isLogueado) => {
      this.logueado = isLogueado;
    });
    const email: String = localStorage.getItem('email');

    if (email && !this.logueado) {
      const userLoginRequest: fromUser.EmailPasswordCredentials = {
        email: localStorage.getItem('email'),
        password: localStorage.getItem('clave'),
      };
      this.store.dispatch(new fromUser.SignInEmail(userLoginRequest));
    }

    this.fondo = this.logueado ? false : true;
    this.textoBoton = !this.fondo ? 'Iniciar Sesión' : 'Home';


  }

  ControlarFondo() {
    this.fondo = !this.fondo;
    this.textoBoton = !this.fondo ? 'Iniciar Sesión' : 'Home';
  }

  Logueado(): Observable<boolean> {
    return this.userStateService.userState$.pipe(
      map((userState) => {
        this.IsAdmin = userState.isAdmin;
        this.idUser = userState.id;
        this.isSuperAdmin = userState.isSuperAdmin;
        this.idGrupo = userState.idGrupo;
        this.url = this.IsAdmin ? '' : '/assets/fondo.jpg';
        if (userState.loading === false) {
          return false;
        }
        return true;
      })
    );
  }

  onToggleSpinner(): void {
    this.showSpinner = !this.showSpinner;
  }

  onSuccess(): void {
    this.notification.success('El procedimiento fue exitoso');
  }

  onError(): void {
    this.notification.error('Se encontraron errores en el proceso');
  }
}
