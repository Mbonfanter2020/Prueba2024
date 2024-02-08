import { Injectable } from '@angular/core';
import { Grupos } from '@app/models/backend/login/grupos';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GruposService {

  private endpoint:string = environment.url;
  private apiUrl:string = this.endpoint + "api/grupos/"
  constructor(private http:HttpClient) { }

  get():Observable<Grupos[]>{
    return this.http.get<Grupos[]>(this.apiUrl);
  }

  getById(idpermiso:Number):Observable<Grupos>{
    return this.http.get<Grupos>(`${this.apiUrl}${idpermiso}/`);
  }

  getByIdNombre(nombre:String):Observable<Grupos[]>{
    return this.http.get<Grupos[]>(`${this.apiUrl}?name=${nombre}`);
  }

  add(modelo:Grupos):Observable<Grupos> {
    return this.http.post<Grupos>(this.apiUrl,modelo);
  }

  update(iSolicitud:Number,modelo:Grupos):Observable<Grupos> {
    return this.http.put<Grupos>(`${this.apiUrl}${iSolicitud}/`,modelo);
  }

  delete(iSolicitud:Number):Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${iSolicitud}/`);
  }
}
