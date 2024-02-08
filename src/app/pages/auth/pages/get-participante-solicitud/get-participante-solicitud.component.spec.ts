import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetParticipanteSolicitudComponent } from './get-participante-solicitud.component';

describe('GetParticipanteSolicitudComponent', () => {
  let component: GetParticipanteSolicitudComponent;
  let fixture: ComponentFixture<GetParticipanteSolicitudComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GetParticipanteSolicitudComponent]
    });
    fixture = TestBed.createComponent(GetParticipanteSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
