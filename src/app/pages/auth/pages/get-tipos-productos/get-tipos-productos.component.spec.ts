import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetTiposProductosComponent } from './get-tipos-productos.component';

describe('GetTiposProductosComponent', () => {
  let component: GetTiposProductosComponent;
  let fixture: ComponentFixture<GetTiposProductosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GetTiposProductosComponent]
    });
    fixture = TestBed.createComponent(GetTiposProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
