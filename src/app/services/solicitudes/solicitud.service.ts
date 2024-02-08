import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { Solicitud } from '@app/models/backend/solicitudes/solicitud';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {
  private endpoint:string = environment.url;
  private apiUrl:string = this.endpoint + "api/solicitudes/"
  constructor(private http:HttpClient) { }


  get():Observable<Solicitud[]>{
    return this.http.get<Solicitud[]>(this.apiUrl);
  }

  getById(id:Number):Observable<Solicitud>{
    return this.http.get<Solicitud>(`${this.apiUrl}${id}/`);
  }

  getByUsuario(idUsuario:Number):Observable<Solicitud[]>{
    return this.http.get<Solicitud[]>(`${this.apiUrl}?usuario=${idUsuario}`);
  }

  add(modelo:Solicitud):Observable<Solicitud> {
    return this.http.post<Solicitud>(this.apiUrl,modelo);
  }

  update(iSolicitud:Number,modelo:Solicitud):Observable<Solicitud> {
    return this.http.put<Solicitud>(`${this.apiUrl}${iSolicitud}/`,modelo);
  }

  delete(iSolicitud:Number):Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${iSolicitud}/`);
  }
}
