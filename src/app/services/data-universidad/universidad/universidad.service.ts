import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { Universidad } from '@app/models/backend/data-universidad/universidad/universidad';


@Injectable({
  providedIn: 'root'
})
export class UniversidadService {
  private endpoint:string = environment.url;
  private apiUrl:string = this.endpoint + "api/universidades/"
  constructor(private http:HttpClient) { }


  get():Observable<Universidad[]>{
    return this.http.get<Universidad[]>(this.apiUrl);
  }

  getById(id:Number):Observable<Universidad>{
    return this.http.get<Universidad>(`${this.apiUrl}${id}/`);
  }

  getByUsuario(idUsuario:Number):Observable<Universidad[]>{
    return this.http.get<Universidad[]>(`${this.apiUrl}?usuario=${idUsuario}`);
  }


  add(modelo:Universidad):Observable<Universidad> {
    return this.http.post<Universidad>(this.apiUrl,modelo);
  }

  update(iSolicitud:Number,modelo:Universidad):Observable<Universidad> {
    return this.http.put<Universidad>(`${this.apiUrl}${iSolicitud}/`,modelo);
  }

  delete(iSolicitud:Number):Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${iSolicitud}/`);
  }
}
