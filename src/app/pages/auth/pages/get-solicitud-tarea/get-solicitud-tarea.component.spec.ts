import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetSolicitudTareaComponent } from './get-solicitud-tarea.component';

describe('GetSolicitudTareaComponent', () => {
  let component: GetSolicitudTareaComponent;
  let fixture: ComponentFixture<GetSolicitudTareaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GetSolicitudTareaComponent]
    });
    fixture = TestBed.createComponent(GetSolicitudTareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
