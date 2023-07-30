import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashUserProductComponent } from './dash-user-product.component';

describe('DashUserComponent', () => {
  let component: DashUserProductComponent;
  let fixture: ComponentFixture<DashUserProductComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashUserProductComponent]
    });
    fixture = TestBed.createComponent(DashUserProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
