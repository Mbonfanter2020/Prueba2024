import { TestBed } from '@angular/core/testing';


import { SolicitudParticipanteService } from './solicitud-participante.service';

describe('SolicitudParticipanteService', () => {
  let service: SolicitudParticipanteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolicitudParticipanteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
