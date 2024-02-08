import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SolicitudMetodologiaTipoProducto } from '@app/models/backend/data-universidad/proyecto/solicitud-metodologia-tipo-producto';


@Injectable({
  providedIn: 'root'
})
export class SolicitudMetodologiaTipoProductoService {
  private endpoint:string = environment.url;
  private apiUrl:string = this.endpoint + "api/solicitud_metodologia_tipo_prodct/"
  constructor(private http:HttpClient) { }


  get():Observable<SolicitudMetodologiaTipoProducto[]>{
    return this.http.get<SolicitudMetodologiaTipoProducto[]>(this.apiUrl);
  }

  getByIdMetodologia(id:Number):Observable<SolicitudMetodologiaTipoProducto[]>{
    return this.http.get<SolicitudMetodologiaTipoProducto[]>(`${this.apiUrl}?idSolicitudMetodologia=${id}`);
  }

  add(modelo:SolicitudMetodologiaTipoProducto):Observable<SolicitudMetodologiaTipoProducto> {
    return this.http.post<SolicitudMetodologiaTipoProducto>(this.apiUrl,modelo);
  }

  update(iSolicitud:Number,modelo:SolicitudMetodologiaTipoProducto):Observable<SolicitudMetodologiaTipoProducto> {
    return this.http.put<SolicitudMetodologiaTipoProducto>(`${this.apiUrl}${iSolicitud}/`,modelo);
  }

  delete(idSede:Number):Observable<SolicitudMetodologiaTipoProducto> {
    return this.http.delete<SolicitudMetodologiaTipoProducto>(`${this.apiUrl}${idSede}/`);
  }

  getByIds(ids: string ):Observable<SolicitudMetodologiaTipoProducto[]>{
    return this.http.get<SolicitudMetodologiaTipoProducto[]>(`${this.apiUrl}?${ids}`);
  }
}
