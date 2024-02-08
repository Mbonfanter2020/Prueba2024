import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { TipoIdentificacion } from '@app/models/backend/datos-principales/tipo-identificacion';

@Injectable({
  providedIn: 'root'
})
export class TipoIdentificacionService {
  private endpoint:string = environment.url;
  private apiUrl:string = this.endpoint + "api/tipos_identificaion/"
  constructor(private http:HttpClient) { }

  get():Observable<TipoIdentificacion[]>{
    return this.http.get<TipoIdentificacion[]>(this.apiUrl);
  }

  getById(id:Number):Observable<TipoIdentificacion>{
    return this.http.get<TipoIdentificacion>(`${this.apiUrl}${id}/`);
  }
}
