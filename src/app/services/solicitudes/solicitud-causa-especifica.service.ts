import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { SolicitudCausaEspecifica } from '@app/models/backend/solicitudes/solicitud-causa-especifica';
@Injectable({
  providedIn: 'root'
})
export class SolicitudCausaEspecificaService {

  private endpoint:string = environment.url;
  private apiUrl:string = this.endpoint + "api/solicitudes_causas_detalle/"
  constructor(private http:HttpClient) { }

  getByIdCausa(idCausa:Number):Observable<SolicitudCausaEspecifica[]>{
    return this.http.get<SolicitudCausaEspecifica[]>(`${this.apiUrl}?idCausa=${idCausa}`);
  }

  get():Observable<SolicitudCausaEspecifica[]>{
    return this.http.get<SolicitudCausaEspecifica[]>(this.apiUrl);
  }


  add(modelo:SolicitudCausaEspecifica):Observable<SolicitudCausaEspecifica> {
    return this.http.post<SolicitudCausaEspecifica>(this.apiUrl,modelo);
  }

  update(iSolicitud:number,modelo:SolicitudCausaEspecifica):Observable<SolicitudCausaEspecifica> {
    return this.http.put<SolicitudCausaEspecifica>(`${this.apiUrl}${iSolicitud}/`,modelo);
  }

  delete(iSolicitud:Number):Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${iSolicitud}/`);
  }

}
