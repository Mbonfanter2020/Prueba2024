import { TestBed } from '@angular/core/testing';

import { PalabraClaveService } from './palabra-clave.service';

describe('PalabraClaveService', () => {
  let service: PalabraClaveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PalabraClaveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
