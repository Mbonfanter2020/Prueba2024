import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetFacultadComponent } from './get-facultad.component';

describe('GetFacultadComponent', () => {
  let component: GetFacultadComponent;
  let fixture: ComponentFixture<GetFacultadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GetFacultadComponent]
    });
    fixture = TestBed.createComponent(GetFacultadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
