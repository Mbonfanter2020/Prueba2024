import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetCambiarRolComponent } from './get-cambiar-rol.component';

describe('GetCambiarRolComponent', () => {
  let component: GetCambiarRolComponent;
  let fixture: ComponentFixture<GetCambiarRolComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GetCambiarRolComponent]
    });
    fixture = TestBed.createComponent(GetCambiarRolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
