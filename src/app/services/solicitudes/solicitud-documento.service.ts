import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SolicitudDocumento } from '@app/models/backend/solicitudes/solicitud-documento';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitudDocumentoService {

  private endpoint:string = environment.url;
  private apiUrl:string = this.endpoint + "api/solicitudes_documentos/"
  constructor(private http:HttpClient) { }


  get():Observable<SolicitudDocumento[]>{
    return this.http.get<SolicitudDocumento[]>(this.apiUrl);
  }

  getByIdSolicitud(idSolicitud:Number):Observable<SolicitudDocumento[]>{
    return this.http.get<SolicitudDocumento[]>(`${this.apiUrl}?idSolicitud=${idSolicitud}`);
  }

  add(modelo:SolicitudDocumento):Observable<SolicitudDocumento> {
    return this.http.post<SolicitudDocumento>(this.apiUrl,modelo);
  }

  update(iSolicitud:Number,modelo:SolicitudDocumento):Observable<SolicitudDocumento> {
    return this.http.put<SolicitudDocumento>(`${this.apiUrl}${iSolicitud}/`,modelo);
  }

  delete(iSolicitud:Number):Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${iSolicitud}/`);
  }

}
