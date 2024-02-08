import { Injectable } from '@angular/core';
import { Producto } from '@app/models/backend/data-universidad/proyecto/producto';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private endpoint:string = environment.url;
  private apiUrl:string = this.endpoint + "api/producto/"
  constructor(private http:HttpClient) { }


  get():Observable<Producto[]>{
    return this.http.get<Producto[]>(this.apiUrl);
  }

  getBySolicitud(id:Number):Observable<Producto[]>{
    return this.http.get<Producto[]>(`${this.apiUrl}?idSolicitud=${id}`);
  }

  getByIds(ids: string ):Observable<Producto[]>{
    return this.http.get<Producto[]>(`${this.apiUrl}?${ids}`);
  }

  add(modelo:Producto):Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl,modelo);
  }

  update(id:Number,modelo:Producto):Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}${id}/`,modelo);
  }


  delete(idSede:Number):Observable<Producto> {
    return this.http.delete<Producto>(`${this.apiUrl}${idSede}/`);
  }
}
