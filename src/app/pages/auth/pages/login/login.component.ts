import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import  * as fromRoot from '@app/store'
import  * as fromUser from '@app/store/user'
import { Store } from '@ngrx/store';
import { UserEstado } from '@app/models/backend/login/usuario-estado';
import { UserStateService } from '@app/services/login/user-state.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loading$ !: Observable<boolean | null>;
  usuario = '';
 clave = '';
  constructor(
    private store : Store<fromRoot.State>,
  ){ }


  ngOnInit(): void {

  }



  loginUsuario(form: NgForm){
    const userLoginRequest: fromUser.EmailPasswordCredentials = {
      email : form.value.email,
      password: form.value.password
    }

    this.store.dispatch(new fromUser.SignInEmail(userLoginRequest))
  }
}
