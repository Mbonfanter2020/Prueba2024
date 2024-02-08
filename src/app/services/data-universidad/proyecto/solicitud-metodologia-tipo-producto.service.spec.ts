import { TestBed } from '@angular/core/testing';

import { SolicitudMetodologiaTipoProductoService } from './solicitud-metodologia-tipo-producto.service';

describe('SolicitudMetodologiaTipoProductoService', () => {
  let service: SolicitudMetodologiaTipoProductoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolicitudMetodologiaTipoProductoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
