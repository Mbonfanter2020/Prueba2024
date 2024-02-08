import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as fromActions from './user.actions';
import { NotificationService } from '@app/services';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { Observable, of} from 'rxjs';
import { catchError, map,switchMap,tap} from 'rxjs/operators';
import { UserResponse } from './user.models';
import { environment } from '@src/environments/environment';
import { UserEstado } from '@app/models/backend/login/usuario-estado';
import { UserStateService } from '@app/services/login/user-state.service';

type Action = fromActions.All;

@Injectable()
export class UserEfects {
  redireccionar: boolean = false;
  constructor(
    private httpClient: HttpClient,
    private actions: Actions,
    private notification: NotificationService,
    private router: Router,
    private userStateService:UserStateService
  ) {}

  signUpEmail: Observable<Action> = createEffect(() =>
    this.actions.pipe(
      ofType(fromActions.Types.SIGIN_UP_EMAIL),
      map((action: fromActions.SignUpEmail) => action.user),
      switchMap((userData) =>
        this.httpClient
          .post<UserResponse>(`${environment.url}account/registred/`, userData)
          .pipe(
            tap((response: UserResponse) => {
              localStorage.setItem('email', response.email);
              localStorage.setItem('clave', userData.password);
              this.router.navigate(['/']);
            }),
            map(
              (response: UserResponse) =>
                new fromActions.SignUpEmailSuccess(
                  response.email,
                  response || null
                )
            ),
            catchError((err) => {
              this.notification.error('Errores al registrar un nuevo usuario');
              return of(new fromActions.SignUpEmailError(err.message));
            })
          )
      )
    )
  );

  signInEmail: Observable<Action> = createEffect(() =>
    this.actions.pipe(
      ofType(fromActions.Types.SIGIN_IN_EMAIL),
      map((action: fromActions.SignInEmail) => action.credentials),
      switchMap((userData) =>
        this.httpClient
          .post<UserResponse>(`${environment.url}account/login-app/`, userData)
          .pipe(
            tap((response: UserResponse) => {

              //console.log('data del usuario', response)
              const userEstado: UserEstado = {
                id: response.id,
                email: response.email,
                username : response.username,
                first_name: response.first_name,
                last_name:response.last_name,
                phone_number: response.phone_number,
                loading: true,
                isAdmin:response.is_admin,
                isSuperAdmin: response.is_superadmin,
                idGrupo: response.groups.at(0)
              };
              const email: String = localStorage.getItem('email');

              if(email){
                this.redireccionar = false;
              }else{

                this.redireccionar = true;
                localStorage.setItem('email', response.email);
                localStorage.setItem('clave', userData.password);
              }

              this.userStateService.setUserState(userEstado);

              if(this.redireccionar){
                this.router.navigate(['/']);
              }

            }),
            map(
              (response: UserResponse) =>
                new fromActions.SignInEmailSuccess(
                  response.email,
                  response || null
                )
            ),
            catchError((err) => {
              const userEstado: UserEstado = {
                id:null,
                email: null,
                username : null,
                first_name: null,
                last_name:null,
                phone_number: null,
                loading: false,
                isAdmin:false,
                isSuperAdmin: false,
                idGrupo: 0
              };
              this.userStateService.setUserState(userEstado);
              localStorage.removeItem('email');
              localStorage.removeItem('clave');
              this.notification.error('Las credenciales son incorrectas');
              return of(new fromActions.SignOutError(err.message));
            })
          )
      )
    )
  );


}
