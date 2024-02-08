import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { Ciudad } from '@app/models/backend/datos-principales/ciudad';


@Injectable({
  providedIn: 'root'
})
export class CiudadService {
  private endpoint:string = environment.url;
  private apiUrl:string = this.endpoint + "api/ciudades/"
  constructor(private http:HttpClient) { }

  getCiudades():Observable<Ciudad[]>{
    return this.http.get<Ciudad[]>(this.apiUrl);
  }
}
