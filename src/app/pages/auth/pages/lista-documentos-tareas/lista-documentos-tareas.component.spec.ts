import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaDocumentosTareasComponent } from './lista-documentos-tareas.component';

describe('ListaDocumentosTareasComponent', () => {
  let component: ListaDocumentosTareasComponent;
  let fixture: ComponentFixture<ListaDocumentosTareasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaDocumentosTareasComponent]
    });
    fixture = TestBed.createComponent(ListaDocumentosTareasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
