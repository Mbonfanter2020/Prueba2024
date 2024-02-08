import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaSedesComponent } from './lista-sedes.component';

describe('ListaSedesComponent', () => {
  let component: ListaSedesComponent;
  let fixture: ComponentFixture<ListaSedesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaSedesComponent]
    });
    fixture = TestBed.createComponent(ListaSedesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
