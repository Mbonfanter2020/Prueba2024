import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SolicitudMetodologia } from '@app/models/backend/solicitudes/solicitud-metodologia';

@Injectable({
  providedIn: 'root'
})
export class SolicitudMetodologiaService {
  private endpoint:string = environment.url;
  private apiUrl:string = this.endpoint + "api/solicitud_metodologia/"
  constructor(private http:HttpClient) { }


  get():Observable<SolicitudMetodologia[]>{
    return this.http.get<SolicitudMetodologia[]>(this.apiUrl);
  }

  getBySolicitud(id:Number):Observable<SolicitudMetodologia[]>{
    return this.http.get<SolicitudMetodologia[]>(`${this.apiUrl}?idSolicitud=${id}`);
  }

  getByIds(ids: string ):Observable<SolicitudMetodologia[]>{
    return this.http.get<SolicitudMetodologia[]>(`${this.apiUrl}?${ids}`);
  }

  add(modelo:SolicitudMetodologia):Observable<SolicitudMetodologia> {
    return this.http.post<SolicitudMetodologia>(this.apiUrl,modelo);
  }

  delete(idSede:Number):Observable<SolicitudMetodologia> {
    return this.http.delete<SolicitudMetodologia>(`${this.apiUrl}${idSede}/`);
  }

}
