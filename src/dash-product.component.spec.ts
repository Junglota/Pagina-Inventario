import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashProductComponent } from './dash-product.component';

describe('DashProductComponent', () => {
  let component: DashProductComponent;
  let fixture: ComponentFixture<DashProductComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashProductComponent]
    });
    fixture = TestBed.createComponent(DashProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
