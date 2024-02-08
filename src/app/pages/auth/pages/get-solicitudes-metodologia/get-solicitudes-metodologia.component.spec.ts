import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetSolicitudesMetodologiaComponent } from './get-solicitudes-metodologia.component';

describe('GetSolicitudesMetodologiaComponent', () => {
  let component: GetSolicitudesMetodologiaComponent;
  let fixture: ComponentFixture<GetSolicitudesMetodologiaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GetSolicitudesMetodologiaComponent]
    });
    fixture = TestBed.createComponent(GetSolicitudesMetodologiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
