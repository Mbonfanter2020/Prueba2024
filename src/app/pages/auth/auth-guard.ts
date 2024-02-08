import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserStateService } from '@app/services/login/user-state.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private userStateService: UserStateService, private router: Router) {}

  canActivate(): Observable<boolean> {
    const email: String = localStorage.getItem('email');
    return this.userStateService.userState$.pipe(
      map(userState => {
        if (userState.loading === false && !email) {
          this.router.navigate(['auth/login']);
          return false;
        }
        return true;
      })
    );
  }
}
