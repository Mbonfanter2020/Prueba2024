import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioTercero } from '@app/models/backend/user/usuario-tercero';

@Injectable({
  providedIn: 'root'
})
export class UsuarioTerceroService {

  private endpoint:string = environment.url;
  private apiUrl:string = this.endpoint + "api/usaurio_tercero/"
  constructor(private http:HttpClient) { }

  get():Observable<UsuarioTercero[]>{
    return this.http.get<UsuarioTercero[]>(this.apiUrl);
  }

  getByIds(ids: string ):Observable<UsuarioTercero[]>{
    return this.http.get<UsuarioTercero[]>(`${this.apiUrl}?${ids}`);
  }

  getByIdsUser(ids: string ):Observable<UsuarioTercero[]>{
    return this.http.get<UsuarioTercero[]>(`${this.apiUrl}?${ids}`);
  }

  getById(idpermiso:Number):Observable<UsuarioTercero[]>{
    return this.http.get<UsuarioTercero[]>(`${this.apiUrl}${idpermiso}/`);
  }

  getByUsuario(id:Number):Observable<UsuarioTercero[]>{
    return this.http.get<UsuarioTercero[]>(`${this.apiUrl}?id_usuario=${id}`);
  }

  add(modelo:UsuarioTercero):Observable<UsuarioTercero> {
    return this.http.post<UsuarioTercero>(this.apiUrl,modelo);
  }


  delete(iSolicitud:Number):Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${iSolicitud}/`);
  }
}
