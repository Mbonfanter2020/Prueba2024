import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '@app/models/backend/user/usuario';
import { UsuarioGet } from '@app/models/backend/user/usuarioGet';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private endpoint:string = environment.url;
  private apiRegUrl:string = this.endpoint + "account/register/"
  private apiUrl:string = this.endpoint + "api/usuarios/"
  constructor(private http:HttpClient) { }


  get():Observable<UsuarioGet[]>{
    return this.http.get<UsuarioGet[]>(this.apiUrl);
  }

  getByIds(ids: string ):Observable<UsuarioGet[]>{
    return this.http.get<UsuarioGet[]>(`${this.apiUrl}?${ids}`);
  }

  getById(id:Number):Observable<UsuarioGet>{
    return this.http.get<UsuarioGet>(`${this.apiUrl}${id}/`);
  }

  add(modelo:Usuario):Observable<Usuario> {
    return this.http.post<Usuario>(this.apiRegUrl,modelo);
  }

  update(iSolicitud:Number,modelo:UsuarioGet):Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}${iSolicitud}/`,modelo);
  }

  delete(iSolicitud:Number):Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${iSolicitud}/`);
  }
}
