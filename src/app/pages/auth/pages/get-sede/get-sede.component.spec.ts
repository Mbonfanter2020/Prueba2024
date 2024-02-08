import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetSedeComponent } from './get-sede.component';

describe('GetSedeComponent', () => {
  let component: GetSedeComponent;
  let fixture: ComponentFixture<GetSedeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GetSedeComponent]
    });
    fixture = TestBed.createComponent(GetSedeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
