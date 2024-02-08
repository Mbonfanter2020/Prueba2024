import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesDocumentosComponent } from './solicitudes-documentos.component';

describe('SolicitudesDocumentosComponent', () => {
  let component: SolicitudesDocumentosComponent;
  let fixture: ComponentFixture<SolicitudesDocumentosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SolicitudesDocumentosComponent]
    });
    fixture = TestBed.createComponent(SolicitudesDocumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
