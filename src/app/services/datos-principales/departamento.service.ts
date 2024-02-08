import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { Departamento } from '@app/models/backend/datos-principales/departamento';



@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {
  private endpoint:string = environment.url;
  private apiUrl:string = this.endpoint + "api/departamentos/"
  constructor(private http:HttpClient) { }

  getDepartamentos():Observable<Departamento[]>{
    return this.http.get<Departamento[]>(this.apiUrl);
  }

  getById(idCausa:Number):Observable<Departamento[]>{
    return this.http.get<Departamento[]>(`${this.apiUrl}${idCausa}/`);
  }

}
