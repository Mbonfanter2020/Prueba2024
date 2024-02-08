import { TestBed } from '@angular/core/testing';

import { SolicitudTareaDocumentoService } from './solicitud-tarea-documento.service';

describe('SolicitudTareaDocumentoService', () => {
  let service: SolicitudTareaDocumentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolicitudTareaDocumentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
