import { TestBed } from '@angular/core/testing';

import { SolicitudEstadoService } from './solicitud-estado.service';

describe('SolicitudEstadoService', () => {
  let service: SolicitudEstadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolicitudEstadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
