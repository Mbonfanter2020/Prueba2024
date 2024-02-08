import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudUniversidadComponent } from './solicitud-universidad.component';

describe('PerfilComponent', () => {
  let component: SolicitudUniversidadComponent;
  let fixture: ComponentFixture<SolicitudUniversidadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SolicitudUniversidadComponent]
    });
    fixture = TestBed.createComponent(SolicitudUniversidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
