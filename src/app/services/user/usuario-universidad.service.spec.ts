import { TestBed } from '@angular/core/testing';

import { UsuarioUniversidadService } from './usuario-universidad.service';

describe('UsuarioUniversidadService', () => {
  let service: UsuarioUniversidadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuarioUniversidadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
