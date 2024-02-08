import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetCausaEfectoComponent } from './get-causa-efecto.component';

describe('GetCausaEfectoComponent', () => {
  let component: GetCausaEfectoComponent;
  let fixture: ComponentFixture<GetCausaEfectoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GetCausaEfectoComponent]
    });
    fixture = TestBed.createComponent(GetCausaEfectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
