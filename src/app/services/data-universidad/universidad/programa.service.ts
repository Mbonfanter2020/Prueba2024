import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Programa } from '@app/models/backend/data-universidad/universidad/programa';



@Injectable({
  providedIn: 'root'
})
export class ProgramaService {
  private endpoint:string = environment.url;
  private apiUrl:string = this.endpoint + "api/programas/"
  constructor(private http:HttpClient) { }


  get():Observable<Programa[]>{
    return this.http.get<Programa[]>(this.apiUrl);
  }


  getByUsuarios(idUsuario:Number):Observable<Programa[]>{
    return this.http.get<Programa[]>(`${this.apiUrl}?usuario=${idUsuario}`);
  }

  getByUniversidad(idUsuario:Number):Observable<Programa[]>{
    return this.http.get<Programa[]>(`${this.apiUrl}?usuario=${idUsuario}`);
  }

  add(modelo:Programa):Observable<Programa> {
    return this.http.post<Programa>(this.apiUrl,modelo);
  }

  update(iSolicitud:Number,modelo:Programa):Observable<Programa> {
    return this.http.put<Programa>(`${this.apiUrl}${iSolicitud}/`,modelo);
  }

  delete(idSede:Number):Observable<Programa> {
    return this.http.delete<Programa>(`${this.apiUrl}${idSede}/`);
  }
}
