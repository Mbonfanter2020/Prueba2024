import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TerceroPrograma } from '@app/models/backend/data-universidad/universidad/tercero-programa';


@Injectable({
  providedIn: 'root'
})
export class TerceroProgramaService {
  private endpoint:string = environment.url;
  private apiUrl:string = this.endpoint + "api/tercero_programa/"
  constructor(private http:HttpClient) { }

  get():Observable<TerceroPrograma[]>{
    return this.http.get<TerceroPrograma[]>(this.apiUrl);
  }

  getById(idpermiso:Number):Observable<TerceroPrograma[]>{
    return this.http.get<TerceroPrograma[]>(`${this.apiUrl}${idpermiso}/`);
  }

  getByTercero(id:Number):Observable<TerceroPrograma[]>{
    return this.http.get<TerceroPrograma[]>(`${this.apiUrl}?idTercero=${id}`);
  }

  add(modelo:TerceroPrograma):Observable<TerceroPrograma> {
    return this.http.post<TerceroPrograma>(this.apiUrl,modelo);
  }


  delete(iSolicitud:Number):Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${iSolicitud}/`);
  }
}
