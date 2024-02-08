import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PalabraClave } from '@app/models/backend/solicitudes/palabra-clave';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PalabraClaveService {

  private endpoint:string = environment.url;
  private apiUrl:string = this.endpoint + "api/palabras_clave/"
  constructor(private http:HttpClient) { }


  get():Observable<PalabraClave[]>{
    return this.http.get<PalabraClave[]>(this.apiUrl);
  }

  getByIdSolicitud(idSolicitud:Number):Observable<PalabraClave[]>{
    return this.http.get<PalabraClave[]>(`${this.apiUrl}?idSolicitud=${idSolicitud}`);
  }

  add(modelo:PalabraClave):Observable<PalabraClave> {
    return this.http.post<PalabraClave>(this.apiUrl,modelo);
  }

  update(iSolicitud:Number,modelo:PalabraClave):Observable<PalabraClave> {
    return this.http.put<PalabraClave>(`${this.apiUrl}${iSolicitud}/`,modelo);
  }

  delete(iSolicitud:Number):Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${iSolicitud}/`);
  }
}
