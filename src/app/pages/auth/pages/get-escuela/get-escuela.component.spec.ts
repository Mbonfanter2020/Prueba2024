import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetEscuelaComponent } from './get-escuela.component';

describe('GetEscuelaComponent', () => {
  let component: GetEscuelaComponent;
  let fixture: ComponentFixture<GetEscuelaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GetEscuelaComponent]
    });
    fixture = TestBed.createComponent(GetEscuelaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
