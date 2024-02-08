import { TestBed } from '@angular/core/testing';

import { SolicitudEfectoEspecificoService } from './solicitud-efecto-especifico.service';

describe('SolicitudEfectoEspecificoService', () => {
  let service: SolicitudEfectoEspecificoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolicitudEfectoEspecificoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
