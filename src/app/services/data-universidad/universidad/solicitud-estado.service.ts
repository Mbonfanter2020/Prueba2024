import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SolicitudEstado } from '@app/models/backend/data-universidad/proyecto/solicitud-estado';
import { SolicitudTipoApoyo } from '@app/models/backend/data-universidad/proyecto/solicitud-tipo-apoyo';
import { SolicitudNivel } from '@app/models/backend/data-universidad/proyecto/solicitud-nivel';

@Injectable({
  providedIn: 'root'
})
export class SolicitudEstadoService {
  private endpoint:string = environment.url;
  private apiUrl:string = this.endpoint + "api/solicitudes/count_por_estado/"
  private apiUrlTipoApoyo:string = this.endpoint + "api/solicitudes/count_por_tipo_apoyo/"
  private apiUrlNivel:string = this.endpoint + "api/solicitudes/count_por_nivel/"
  constructor(private http:HttpClient) { }


  get(ids: string ):Observable<SolicitudEstado>{
    return this.http.get<SolicitudEstado>(`${this.apiUrl}?${ids}`);
  }

  getByTipoApoyo(ids: string ):Observable<SolicitudTipoApoyo>{
    return this.http.get<SolicitudTipoApoyo>(`${this.apiUrlTipoApoyo}?${ids}`);
  }

  getByNivel(ids: string ):Observable<SolicitudNivel>{
    return this.http.get<SolicitudNivel>(`${this.apiUrlNivel}?${ids}`);
  }

}
