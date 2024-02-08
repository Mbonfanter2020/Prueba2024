import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SolicitudParticipante } from '@app/models/backend/solicitudes/solicitud-participantes';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitudParticipanteService {

  private endpoint:string = environment.url;
  private apiUrl:string = this.endpoint + "api/solicitudes_participantes/"
  constructor(private http:HttpClient) { }


  get():Observable<SolicitudParticipante[]>{
    return this.http.get<SolicitudParticipante[]>(this.apiUrl);
  }

  getByIdSolicitud(idSolicitud:Number):Observable<SolicitudParticipante[]>{
    return this.http.get<SolicitudParticipante[]>(`${this.apiUrl}?idSolicitud=${idSolicitud}`);
  }

  add(modelo:SolicitudParticipante):Observable<SolicitudParticipante> {
    return this.http.post<SolicitudParticipante>(this.apiUrl,modelo);
  }

  update(iSolicitud:Number,modelo:SolicitudParticipante):Observable<SolicitudParticipante> {
    return this.http.put<SolicitudParticipante>(`${this.apiUrl}${iSolicitud}/`,modelo);
  }

  delete(iSolicitud:Number):Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${iSolicitud}/`);
  }
}
