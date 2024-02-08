import { TestBed } from '@angular/core/testing';

import { SolicitudCausaGeneralService } from './solicitud-causa-general.service';

describe('SolicitudCausaGeneralService', () => {
  let service: SolicitudCausaGeneralService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolicitudCausaGeneralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
