import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaSolicitudesAdminComponent } from './lista-solicitudes-admin.component';

describe('ListaSolicitudesComponent', () => {
  let component: ListaSolicitudesAdminComponent;
  let fixture: ComponentFixture<ListaSolicitudesAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaSolicitudesAdminComponent]
    });
    fixture = TestBed.createComponent(ListaSolicitudesAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
