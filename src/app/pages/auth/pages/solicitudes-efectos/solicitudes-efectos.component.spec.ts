import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesEfectosComponent } from './solicitudes-efectos.component';

describe('SolicitudesEfectosComponent', () => {
  let component: SolicitudesEfectosComponent;
  let fixture: ComponentFixture<SolicitudesEfectosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SolicitudesEfectosComponent]
    });
    fixture = TestBed.createComponent(SolicitudesEfectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
