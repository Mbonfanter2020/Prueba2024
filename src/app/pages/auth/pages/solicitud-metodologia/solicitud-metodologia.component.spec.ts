import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudMetodologiaComponent } from './solicitud-metodologia.component';

describe('SolicitudDocenteEstudianteComponent', () => {
  let component: SolicitudMetodologiaComponent;
  let fixture: ComponentFixture<SolicitudMetodologiaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SolicitudMetodologiaComponent]
    });
    fixture = TestBed.createComponent(SolicitudMetodologiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
