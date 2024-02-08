import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetSolicitudUniversidadComponent } from './get-solicitud-universidad.component';

describe('GetParticipanteSolicitudComponent', () => {
  let component: GetSolicitudUniversidadComponent;
  let fixture: ComponentFixture<GetSolicitudUniversidadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GetSolicitudUniversidadComponent]
    });
    fixture = TestBed.createComponent(GetSolicitudUniversidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
