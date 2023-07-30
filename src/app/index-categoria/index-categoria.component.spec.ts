import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexCategoriaComponent } from './index-categoria.component';

describe('IndexCategoriaComponent', () => {
  let component: IndexCategoriaComponent;
  let fixture: ComponentFixture<IndexCategoriaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndexCategoriaComponent]
    });
    fixture = TestBed.createComponent(IndexCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
