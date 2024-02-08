import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { SolicitudEfectoGeneral } from '@app/models/backend/solicitudes/solicitud-efecto-general';

@Injectable({
  providedIn: 'root'
})
export class SolicitudEfectoGeneralService {

  private endpoint:string = environment.url;
  private apiUrl:string = this.endpoint + "api/solicitudes_efectos/"
  constructor(private http:HttpClient) { }


  get():Observable<SolicitudEfectoGeneral[]>{
    return this.http.get<SolicitudEfectoGeneral[]>(this.apiUrl);
  }

  getByIdSolicitud(idSolicitud:Number):Observable<SolicitudEfectoGeneral[]>{
    return this.http.get<SolicitudEfectoGeneral[]>(`${this.apiUrl}?idSolicitud=${idSolicitud}`);
  }

  add(modelo:SolicitudEfectoGeneral):Observable<SolicitudEfectoGeneral> {
    return this.http.post<SolicitudEfectoGeneral>(this.apiUrl,modelo);
  }

  update(iSolicitud:Number,modelo:SolicitudEfectoGeneral):Observable<SolicitudEfectoGeneral> {
    return this.http.put<SolicitudEfectoGeneral>(`${this.apiUrl}${iSolicitud}/`,modelo);
  }

  delete(iSolicitud:Number):Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${iSolicitud}/`);
  }
}
