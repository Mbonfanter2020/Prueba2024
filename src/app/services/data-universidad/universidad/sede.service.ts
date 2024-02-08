import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Sede } from '@app/models/backend/data-universidad/universidad/sede';

@Injectable({
  providedIn: 'root'
})
export class SedeService {
  private endpoint:string = environment.url;
  private apiUrl:string = this.endpoint + "api/sedes/"
  constructor(private http:HttpClient) { }


  get():Observable<Sede[]>{
    return this.http.get<Sede[]>(this.apiUrl);
  }

  getById(id:Number):Observable<Sede>{
    return this.http.get<Sede>(`${this.apiUrl}${id}/`);
  }

  getByUsuario(idUsuario:Number):Observable<Sede[]>{
    return this.http.get<Sede[]>(`${this.apiUrl}?usuario=${idUsuario}`);
  }

  getByUniversidad(idUniversidad:Number):Observable<Sede[]>{
    return this.http.get<Sede[]>(`${this.apiUrl}?codigoUniversidad=${idUniversidad}`);
  }


  add(modelo:Sede):Observable<Sede> {
    return this.http.post<Sede>(this.apiUrl,modelo);
  }

  update(iSolicitud:Number,modelo:Sede):Observable<Sede> {
    return this.http.put<Sede>(`${this.apiUrl}${iSolicitud}/`,modelo);
  }

  delete(idSede:Number):Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${idSede}/`);
  }
}
