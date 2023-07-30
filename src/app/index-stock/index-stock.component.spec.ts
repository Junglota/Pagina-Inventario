import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexStockComponent } from './index-stock.component';

describe('IndexStockComponent', () => {
  let component: IndexStockComponent;
  let fixture: ComponentFixture<IndexStockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndexStockComponent]
    });
    fixture = TestBed.createComponent(IndexStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
