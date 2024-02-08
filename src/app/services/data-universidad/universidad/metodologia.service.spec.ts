import { TestBed } from '@angular/core/testing';

import { MetodologiaService } from './metodologia.service';

describe('MetodologiaService', () => {
  let service: MetodologiaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetodologiaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
