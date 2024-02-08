import { Injectable } from '@angular/core';
import { Metodologia } from '@app/models/backend/data-universidad/proyecto/metodologia';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Sede } from '@app/models/backend/data-universidad/universidad/sede';


@Injectable({
  providedIn: 'root'
})
export class MetodologiaService {
  private endpoint:string = environment.url;
  private apiUrl:string = this.endpoint + "api/metodologia/"
  constructor(private http:HttpClient) { }


  get():Observable<Metodologia[]>{
    return this.http.get<Metodologia[]>(this.apiUrl);
  }

  getByIds(ids: string ):Observable<Metodologia[]>{
    return this.http.get<Metodologia[]>(`${this.apiUrl}?${ids}`);
  }

  getByUsuarios(idUsuario:Number):Observable<Metodologia[]>{
    return this.http.get<Metodologia[]>(`${this.apiUrl}?usuario=${idUsuario}`);
  }


  add(modelo:Metodologia):Observable<Metodologia> {
    return this.http.post<Metodologia>(this.apiUrl,modelo);
  }

  update(iSolicitud:Number,modelo:Metodologia):Observable<Sede> {
    return this.http.put<Sede>(`${this.apiUrl}${iSolicitud}/`,modelo);
  }

  delete(idSede:Number):Observable<Metodologia> {
    return this.http.delete<Metodologia>(`${this.apiUrl}${idSede}/`);
  }
}
