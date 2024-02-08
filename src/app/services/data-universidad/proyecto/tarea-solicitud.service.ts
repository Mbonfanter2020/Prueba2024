import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SolicitudTarea } from '@app/models/backend/data-universidad/proyecto/solicitud-tarea';

@Injectable({
  providedIn: 'root'
})
export class TareaSolicitudService {
  private endpoint:string = environment.url;
  private apiUrl:string = this.endpoint + "api/solicitud_tarea/"
  constructor(private http:HttpClient) { }


  get():Observable<SolicitudTarea[]>{
    return this.http.get<SolicitudTarea[]>(this.apiUrl);
  }

  getByMetodologiaTipoProd(id:Number):Observable<SolicitudTarea[]>{
    return this.http.get<SolicitudTarea[]>(`${this.apiUrl}?idSolicitudMetodologiaTipoProducto=${id}`);
  }

  getByEstudiante(id:Number):Observable<SolicitudTarea[]>{
    return this.http.get<SolicitudTarea[]>(`${this.apiUrl}?idEstudiante=${id}`);
  }

  getByIds(ids: string ):Observable<SolicitudTarea[]>{
    return this.http.get<SolicitudTarea[]>(`${this.apiUrl}?${ids}`);
  }

  add(modelo:SolicitudTarea):Observable<SolicitudTarea> {
    return this.http.post<SolicitudTarea>(this.apiUrl,modelo);
  }

  delete(idSede:Number):Observable<SolicitudTarea> {
    return this.http.delete<SolicitudTarea>(`${this.apiUrl}${idSede}/`);
  }

  update(iSolicitud:Number,modelo:SolicitudTarea):Observable<SolicitudTarea> {
    return this.http.put<SolicitudTarea>(`${this.apiUrl}${iSolicitud}/`,modelo);
  }

}
