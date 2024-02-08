import { Injectable } from '@angular/core';
import { UsuarioUniversidad } from '@app/models/backend/user/usuario-universidad';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuarioUniversidadService {

  private endpoint:string = environment.url;
  private apiUrl:string = this.endpoint + "api/usuario_universidad/"
  constructor(private http:HttpClient) { }


  get():Observable<UsuarioUniversidad[]>{
    return this.http.get<UsuarioUniversidad[]>(this.apiUrl);
  }

  getByUsuario(idUsuario:Number):Observable<UsuarioUniversidad[]>{
    return this.http.get<UsuarioUniversidad[]>(`${this.apiUrl}?idUsuario=${idUsuario}`);
  }

  getByUniversidad(idUniversidad:Number):Observable<UsuarioUniversidad[]>{
    return this.http.get<UsuarioUniversidad[]>(`${this.apiUrl}?idUniversidad=${idUniversidad}`);
  }

  add(modelo:UsuarioUniversidad):Observable<UsuarioUniversidad> {
    return this.http.post<UsuarioUniversidad>(this.apiUrl,modelo);
  }

  delete(iSolicitud:Number):Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${iSolicitud}/`);
  }
}
