import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Permisos } from '@app/models/backend/login/permisos';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {

  private endpoint:string = environment.url;
  private apiUrl:string = this.endpoint + "api/permisos/"
  constructor(private http:HttpClient) { }

  get():Observable<Permisos[]>{
    return this.http.get<Permisos[]>(this.apiUrl);
  }

  getById(idpermiso:Number):Observable<Permisos>{
    return this.http.get<Permisos>(`${this.apiUrl}${idpermiso}/`);
  }


  add(modelo:Permisos):Observable<Permisos> {
    return this.http.post<Permisos>(this.apiUrl,modelo);
  }

  update(iSolicitud:Number,modelo:Permisos):Observable<Permisos> {
    return this.http.put<Permisos>(`${this.apiUrl}${iSolicitud}/`,modelo);
  }

  delete(iSolicitud:Number):Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${iSolicitud}/`);
  }
}
