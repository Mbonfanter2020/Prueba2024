import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetMetodologiaUniversidadComponent } from './get-metodologia-universidad.component';

describe('GetMetodologiaUniversidadComponent', () => {
  let component: GetMetodologiaUniversidadComponent;
  let fixture: ComponentFixture<GetMetodologiaUniversidadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GetMetodologiaUniversidadComponent]
    });
    fixture = TestBed.createComponent(GetMetodologiaUniversidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
