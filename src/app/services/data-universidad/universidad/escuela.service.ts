import { Injectable } from '@angular/core';
import { Escuela } from '@app/models/backend/data-universidad/universidad/escuela';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EscuelaService {

  private endpoint:string = environment.url;
  private apiUrl:string = this.endpoint + "api/escuelas/"
  constructor(private http:HttpClient) { }


  get():Observable<Escuela[]>{
    return this.http.get<Escuela[]>(this.apiUrl);
  }

  getById(id:Number):Observable<Escuela>{
    return this.http.get<Escuela>(`${this.apiUrl}${id}/`);
  }

  getByUsuario(idUsuario:Number):Observable<Escuela[]>{
    return this.http.get<Escuela[]>(`${this.apiUrl}?usuario=${idUsuario}`);
  }

  getByUniversidad(idUniversidad:Number):Observable<Escuela[]>{
    return this.http.get<Escuela[]>(`${this.apiUrl}?codigoUniversidad=${idUniversidad}`);
  }

  add(modelo:Escuela):Observable<Escuela> {
    return this.http.post<Escuela>(this.apiUrl,modelo);
  }

  update(iSolicitud:Number,modelo:Escuela):Observable<Escuela> {
    return this.http.put<Escuela>(`${this.apiUrl}${iSolicitud}/`,modelo);
  }

  delete(iSolicitud:Number):Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${iSolicitud}/`);
  }
}
