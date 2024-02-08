import { TestBed } from '@angular/core/testing';

import { HistorialSolicitudService } from './historial-solicitud.service';

describe('HistorialSolicitudService', () => {
  let service: HistorialSolicitudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistorialSolicitudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
