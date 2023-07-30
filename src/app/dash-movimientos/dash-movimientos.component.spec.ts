import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashMovimientosComponent } from './dash-movimientos.component';

describe('DashMovimientosComponent', () => {
  let component: DashMovimientosComponent;
  let fixture: ComponentFixture<DashMovimientosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashMovimientosComponent]
    });
    fixture = TestBed.createComponent(DashMovimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});