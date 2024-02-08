import { TestBed } from '@angular/core/testing';

import { TerceroProgramaService } from './tercero-programa.service';

describe('TerceroProgramaService', () => {
  let service: TerceroProgramaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TerceroProgramaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
