import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashConfiguracionComponent } from './dash-configuracion.component';

describe('DashConfiguracionComponent', () => {
  let component: DashConfiguracionComponent;
  let fixture: ComponentFixture<DashConfiguracionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashConfiguracionComponent]
    });
    fixture = TestBed.createComponent(DashConfiguracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
