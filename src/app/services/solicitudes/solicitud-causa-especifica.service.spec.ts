import { TestBed } from '@angular/core/testing';

import { SolicitudCausaEspecificaService } from './solicitud-causa-especifica.service';

describe('SolicitudCausaEspecificaService', () => {
  let service: SolicitudCausaEspecificaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolicitudCausaEspecificaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
