import { TestBed } from '@angular/core/testing';

import { SolicitudDocumentoService } from './solicitud-documento.service';

describe('SolicitudDocumentoService', () => {
  let service: SolicitudDocumentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolicitudDocumentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
