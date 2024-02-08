import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetCambiarProgramaComponent } from './get-cambiar-programa.component';

describe('GetCambiarProgramaComponent', () => {
  let component: GetCambiarProgramaComponent;
  let fixture: ComponentFixture<GetCambiarProgramaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GetCambiarProgramaComponent]
    });
    fixture = TestBed.createComponent(GetCambiarProgramaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
