import { TestBed } from '@angular/core/testing';

import { SolicitudMetodologiaService } from './solicitud-metodologia.service';

describe('SolicitudDocenteEstudianteService', () => {
  let service: SolicitudMetodologiaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolicitudMetodologiaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
