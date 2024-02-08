import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TipoProducto } from '@app/models/backend/data-universidad/proyecto/tipo-producto';

@Injectable({
  providedIn: 'root'
})
export class TipoProductoService {
  private endpoint:string = environment.url;
  private apiUrl:string = this.endpoint + "api/tipo_producto/"
  constructor(private http:HttpClient) { }


  get():Observable<TipoProducto[]>{
    return this.http.get<TipoProducto[]>(this.apiUrl);
  }

  getBySolicitud(id:Number):Observable<TipoProducto[]>{
    return this.http.get<TipoProducto[]>(`${this.apiUrl}?idSolicitud=${id}`);
  }

  getByIds(ids: string ):Observable<TipoProducto[]>{
    return this.http.get<TipoProducto[]>(`${this.apiUrl}?${ids}`);
  }

  add(modelo:TipoProducto):Observable<TipoProducto> {
    return this.http.post<TipoProducto>(this.apiUrl,modelo);
  }

  update(id:Number,modelo:TipoProducto):Observable<TipoProducto> {
    return this.http.put<TipoProducto>(`${this.apiUrl}${id}/`,modelo);
  }


  delete(idSede:Number):Observable<TipoProducto> {
    return this.http.delete<TipoProducto>(`${this.apiUrl}${idSede}/`);
  }
}
