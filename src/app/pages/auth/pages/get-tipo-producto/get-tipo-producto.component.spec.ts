import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetTipoProductoComponent } from './get-tipo-producto.component';

describe('GetTipoProductoComponent', () => {
  let component: GetTipoProductoComponent;
  let fixture: ComponentFixture<GetTipoProductoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GetTipoProductoComponent]
    });
    fixture = TestBed.createComponent(GetTipoProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
