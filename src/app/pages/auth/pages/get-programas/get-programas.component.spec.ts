import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetProgramasComponent } from './get-programas.component';

describe('GetProgramasComponent', () => {
  let component: GetProgramasComponent;
  let fixture: ComponentFixture<GetProgramasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GetProgramasComponent]
    });
    fixture = TestBed.createComponent(GetProgramasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
