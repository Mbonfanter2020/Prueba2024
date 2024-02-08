import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesCausasComponent } from './solicitudes-causas.component';

describe('SolicitudesCausasComponent', () => {
  let component: SolicitudesCausasComponent;
  let fixture: ComponentFixture<SolicitudesCausasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SolicitudesCausasComponent]
    });
    fixture = TestBed.createComponent(SolicitudesCausasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
