import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaTareasSolicitudComponent } from './lista-tareas-solicitud.component';

describe('ListaTareasSolicitudComponent', () => {
  let component: ListaTareasSolicitudComponent;
  let fixture: ComponentFixture<ListaTareasSolicitudComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaTareasSolicitudComponent]
    });
    fixture = TestBed.createComponent(ListaTareasSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
