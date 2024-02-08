import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextCodigoNombreComponent } from './text-codigo-nombre.component';

describe('TextCodigoNombreComponent', () => {
  let component: TextCodigoNombreComponent;
  let fixture: ComponentFixture<TextCodigoNombreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TextCodigoNombreComponent]
    });
    fixture = TestBed.createComponent(TextCodigoNombreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
