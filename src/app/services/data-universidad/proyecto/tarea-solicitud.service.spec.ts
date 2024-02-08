import { TestBed } from '@angular/core/testing';
import { TareaSolicitudService } from './tarea-solicitud.service';


describe('TipoProductoService', () => {
  let service: TareaSolicitudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TareaSolicitudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
