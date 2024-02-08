import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SolicitudTareaDocumento } from '@app/models/backend/data-universidad/proyecto/solicitud-tarea-documentos';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitudTareaDocumentoService {

  private endpoint:string = environment.url;
  private apiUrl:string = this.endpoint + "api/solicitud_tarea_documentos/"
  constructor(private http:HttpClient) { }


  get():Observable<SolicitudTareaDocumento[]>{
    return this.http.get<SolicitudTareaDocumento[]>(this.apiUrl);
  }

  getByIdSolicitud(idSolicitud:Number):Observable<SolicitudTareaDocumento[]>{
    return this.http.get<SolicitudTareaDocumento[]>(`${this.apiUrl}?idSolicitudTarea=${idSolicitud}`);
  }

  add(modelo:SolicitudTareaDocumento):Observable<SolicitudTareaDocumento> {
    return this.http.post<SolicitudTareaDocumento>(this.apiUrl,modelo);
  }

  update(iSolicitud:Number,modelo:SolicitudTareaDocumento):Observable<SolicitudTareaDocumento> {
    return this.http.put<SolicitudTareaDocumento>(`${this.apiUrl}${iSolicitud}/`,modelo);
  }

  delete(iSolicitud:Number):Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${iSolicitud}/`);
  }
}
