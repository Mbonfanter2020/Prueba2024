import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaDinamicaComponent } from './tabla-dinamica.component';

describe('TablaDinamicaComponent', () => {
  let component: TablaDinamicaComponent;
  let fixture: ComponentFixture<TablaDinamicaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablaDinamicaComponent]
    });
    fixture = TestBed.createComponent(TablaDinamicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
