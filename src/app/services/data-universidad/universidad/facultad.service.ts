import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Facultad } from '@app/models/backend/data-universidad/universidad/facultad';

@Injectable({
  providedIn: 'root'
})
export class FacultadService {
  private endpoint:string = environment.url;
  private apiUrl:string = this.endpoint + "api/facultades/"
  constructor(private http:HttpClient) { }


  get():Observable<Facultad[]>{
    return this.http.get<Facultad[]>(this.apiUrl);
  }

  getById(id:Number):Observable<Facultad>{
    return this.http.get<Facultad>(`${this.apiUrl}${id}/`);
  }

  getByUsuario(idUsuario:Number):Observable<Facultad[]>{
    return this.http.get<Facultad[]>(`${this.apiUrl}?usuario=${idUsuario}`);
  }

  getByUniversidad(idUniversidad:Number):Observable<Facultad[]>{
    return this.http.get<Facultad[]>(`${this.apiUrl}?codigoUniversidad=${idUniversidad}`);
  }

  add(modelo:Facultad):Observable<Facultad> {
    return this.http.post<Facultad>(this.apiUrl,modelo);
  }

  update(iSolicitud:Number,modelo:Facultad):Observable<Facultad> {
    return this.http.put<Facultad>(`${this.apiUrl}${iSolicitud}/`,modelo);
  }

  delete(idFacultad:Number):Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${idFacultad}/`);
  }
}
