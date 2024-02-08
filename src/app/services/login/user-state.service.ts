import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserState } from '@app/store/user/user.reducer'; // Asegúrate de importar correctamente tu interfaz
import { UserEstado } from '@app/models/backend/login/usuario-estado';

@Injectable({
  providedIn: 'root'
})
export class UserStateService {
  private userStateSubject = new BehaviorSubject<UserEstado>({
    id: null,
    email: null,
    username : null,
    first_name: null,
    last_name:null,
    phone_number: null,
    loading: false,
    isAdmin:false,
    isSuperAdmin:false,
    idGrupo:0
  });

  // Observable que emite el estado del usuario

  userState$: Observable<UserEstado> = this.userStateSubject.asObservable();

  // Método para actualizar el estado del usuario
  setUserState(newState: UserEstado): void {
    this.userStateSubject.next(newState);
  }
}
