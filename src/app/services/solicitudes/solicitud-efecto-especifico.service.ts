import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { SolicitudEfectoEspecifico } from '@app/models/backend/solicitudes/solicitud-efecto-especifico';

@Injectable({
  providedIn: 'root'
})
export class SolicitudEfectoEspecificoService {

  private endpoint:string = environment.url;
  private apiUrl:string = this.endpoint + "api/solicitudes_efectos_detalle/"
  constructor(private http:HttpClient) { }

  getByIdEfecto(idEfecto:Number):Observable<SolicitudEfectoEspecifico[]>{
    return this.http.get<SolicitudEfectoEspecifico[]>(`${this.apiUrl}?idEfecto=${idEfecto}`);
  }

  get():Observable<SolicitudEfectoEspecifico[]>{
    return this.http.get<SolicitudEfectoEspecifico[]>(this.apiUrl);
  }


  add(modelo:SolicitudEfectoEspecifico):Observable<SolicitudEfectoEspecifico> {
    return this.http.post<SolicitudEfectoEspecifico>(this.apiUrl,modelo);
  }

  update(iSolicitud:number,modelo:SolicitudEfectoEspecifico):Observable<SolicitudEfectoEspecifico> {
    return this.http.put<SolicitudEfectoEspecifico>(`${this.apiUrl}${iSolicitud}/`,modelo);
  }

  delete(iSolicitud:Number):Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${iSolicitud}/`);
  }

}
