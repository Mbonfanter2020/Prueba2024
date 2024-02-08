import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaEscuelaComponent } from './lista-escuela.component';

describe('ListaEscuelaComponent', () => {
  let component: ListaEscuelaComponent;
  let fixture: ComponentFixture<ListaEscuelaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaEscuelaComponent]
    });
    fixture = TestBed.createComponent(ListaEscuelaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
