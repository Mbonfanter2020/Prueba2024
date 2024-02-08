import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaTipoProductoComponent } from './lista-tipo-producto.component';

describe('ListaTipoProductoComponent', () => {
  let component: ListaTipoProductoComponent;
  let fixture: ComponentFixture<ListaTipoProductoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaTipoProductoComponent]
    });
    fixture = TestBed.createComponent(ListaTipoProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
