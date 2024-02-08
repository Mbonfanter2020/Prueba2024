import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetProductoComponent } from './get-producto.component';

describe('GetProductoComponent', () => {
  let component: GetProductoComponent;
  let fixture: ComponentFixture<GetProductoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GetProductoComponent]
    });
    fixture = TestBed.createComponent(GetProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
