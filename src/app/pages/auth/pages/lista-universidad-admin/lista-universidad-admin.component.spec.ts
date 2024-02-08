import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaUniversidadAdminComponent } from './lista-universidad-admin.component';

describe('ListaUniversidadAdminComponent', () => {
  let component: ListaUniversidadAdminComponent;
  let fixture: ComponentFixture<ListaUniversidadAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaUniversidadAdminComponent]
    });
    fixture = TestBed.createComponent(ListaUniversidadAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
