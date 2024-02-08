import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudTareasComponent } from './solicitud-tareas.component';

describe('SolicitudTareasComponent', () => {
  let component: SolicitudTareasComponent;
  let fixture: ComponentFixture<SolicitudTareasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SolicitudTareasComponent]
    });
    fixture = TestBed.createComponent(SolicitudTareasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
