import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { SolicitudCausaGeneral } from '@app/models/backend/solicitudes/solicitud-causa-general';

@Injectable({
  providedIn: 'root'
})
export class SolicitudCausaGeneralService {

  private endpoint:string = environment.url;
  private apiUrl:string = this.endpoint + "api/solicitudes_causas/"
  constructor(private http:HttpClient) { }


  get():Observable<SolicitudCausaGeneral[]>{
    return this.http.get<SolicitudCausaGeneral[]>(this.apiUrl);
  }

  getByIdSolicitud(idSolicitud:Number):Observable<SolicitudCausaGeneral[]>{
    return this.http.get<SolicitudCausaGeneral[]>(`${this.apiUrl}?idSolicitud=${idSolicitud}`);
  }

  add(modelo:SolicitudCausaGeneral):Observable<SolicitudCausaGeneral> {
    return this.http.post<SolicitudCausaGeneral>(this.apiUrl,modelo);
  }

  update(iSolicitud:Number,modelo:SolicitudCausaGeneral):Observable<SolicitudCausaGeneral> {
    return this.http.put<SolicitudCausaGeneral>(`${this.apiUrl}${iSolicitud}/`,modelo);
  }

  delete(iSolicitud:Number):Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${iSolicitud}/`);
  }
}
