import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaParticipantesComponent } from './lista-participantes.component';

describe('ListaSolicitudesComponent', () => {
  let component: ListaParticipantesComponent;
  let fixture: ComponentFixture<ListaParticipantesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaParticipantesComponent]
    });
    fixture = TestBed.createComponent(ListaParticipantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
