import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudTipoProductoComponent } from './solicitud-tipo-producto.component';

describe('SolicitudTipoProductoComponent', () => {
  let component: SolicitudTipoProductoComponent;
  let fixture: ComponentFixture<SolicitudTipoProductoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SolicitudTipoProductoComponent]
    });
    fixture = TestBed.createComponent(SolicitudTipoProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
