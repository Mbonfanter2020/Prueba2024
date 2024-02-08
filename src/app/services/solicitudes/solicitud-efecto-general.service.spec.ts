import { TestBed } from '@angular/core/testing';

import { SolicitudEfectoGeneralService } from './solicitud-efecto-general.service';

describe('SolicitudEfectoGeneralService', () => {
  let service: SolicitudEfectoGeneralService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolicitudEfectoGeneralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
