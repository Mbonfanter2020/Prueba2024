import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContentType } from '@app/models/backend/login/content-type';

@Injectable({
  providedIn: 'root'
})
export class ContentTypeService {

  private endpoint:string = environment.url;
  private apiUrl:string = this.endpoint + "api/palabras_claves/"
  constructor(private http:HttpClient) { }

  get():Observable<ContentType[]>{
    return this.http.get<ContentType[]>(this.apiUrl);
  }

  getByIdSolicitud(idSolicitud:Number):Observable<ContentType[]>{
    return this.http.get<ContentType[]>(`${this.apiUrl}?idSolicitud=${idSolicitud}`);
  }

  add(modelo:ContentType):Observable<ContentType> {
    return this.http.post<ContentType>(this.apiUrl,modelo);
  }

  update(iSolicitud:Number,modelo:ContentType):Observable<ContentType> {
    return this.http.put<ContentType>(`${this.apiUrl}${iSolicitud}/`,modelo);
  }

  delete(iSolicitud:Number):Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${iSolicitud}/`);
  }
}
