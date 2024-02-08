import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { Tercero } from '@app/models/backend/user/tercero';
import { TerceroUniversidad } from '@app/models/backend/user/tercero-universidad';

@Injectable({
  providedIn: 'root'
})
export class TerceroUniversidadService {

  private endpoint:string = environment.url;
  private apiUrl:string = this.endpoint + "api/tercero_universidad/"
  constructor(private http:HttpClient) { }


  get():Observable<TerceroUniversidad[]>{
    return this.http.get<TerceroUniversidad[]>(this.apiUrl);
  }

  getByTercero(idTercero:Number):Observable<TerceroUniversidad[]>{
    return this.http.get<TerceroUniversidad[]>(`${this.apiUrl}?idTercero=${idTercero}`);
  }

  getByUniversidad(idUniversidad:Number):Observable<TerceroUniversidad[]>{
    return this.http.get<TerceroUniversidad[]>(`${this.apiUrl}?idUniversidad=${idUniversidad}`);
  }

  getById(id:Number):Observable<TerceroUniversidad>{
    return this.http.get<TerceroUniversidad>(`${this.apiUrl}${id}/`);
  }

  add(modelo:TerceroUniversidad):Observable<TerceroUniversidad> {
    return this.http.post<TerceroUniversidad>(this.apiUrl,modelo);
  }

  update(iSolicitud:Number,modelo:TerceroUniversidad):Observable<TerceroUniversidad> {
    return this.http.put<TerceroUniversidad>(`${this.apiUrl}${iSolicitud}/`,modelo);
  }

  delete(iSolicitud:Number):Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${iSolicitud}/`);
  }

  deleteByTercero(modelo: EliminarUniversidaTercero): Observable<void> {
    return this.http.request<void>('delete', `${this.apiUrl}eliminar_tercero/`, {
      body: modelo
    });
  }
}

interface EliminarUniversidaTercero {
  idTercero: Number;
}
