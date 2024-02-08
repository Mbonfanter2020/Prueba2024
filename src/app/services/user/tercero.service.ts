import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { Tercero } from '@app/models/backend/user/tercero';

@Injectable({
  providedIn: 'root'
})
export class TerceroService {

  private endpoint:string = environment.url;
  private apiUrl:string = this.endpoint + "api/terceros/"
  constructor(private http:HttpClient) { }


  get():Observable<Tercero[]>{
    return this.http.get<Tercero[]>(this.apiUrl);
  }

  getByUsuario(idUsuario:Number):Observable<Tercero[]>{
    return this.http.get<Tercero[]>(`${this.apiUrl}${idUsuario}/`);
  }

  getByUniversidad(idUsuario:Number):Observable<Tercero[]>{
    return this.http.get<Tercero[]>(`${this.apiUrl}${idUsuario}/`);
  }

  getById(id:Number):Observable<Tercero>{
    return this.http.get<Tercero>(`${this.apiUrl}${id}/`);
  }

  getByIds(ids: string ):Observable<Tercero[]>{
    return this.http.get<Tercero[]>(`${this.apiUrl}?${ids}`);
  }


  add(modelo:Tercero):Observable<Tercero> {
    return this.http.post<Tercero>(this.apiUrl,modelo);
  }

  update(iSolicitud:Number,modelo:Tercero):Observable<Tercero> {
    return this.http.put<Tercero>(`${this.apiUrl}${iSolicitud}/`,modelo);
  }

  delete(iSolicitud:Number):Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${iSolicitud}/`);
  }
}
