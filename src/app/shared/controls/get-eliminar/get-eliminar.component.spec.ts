import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetEliminarComponent } from './get-eliminar.component';

describe('GetEliminarComponent', () => {
  let component: GetEliminarComponent;
  let fixture: ComponentFixture<GetEliminarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GetEliminarComponent]
    });
    fixture = TestBed.createComponent(GetEliminarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
