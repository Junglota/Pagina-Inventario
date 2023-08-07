import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashTiendasComponent } from './dash-tiendas.component';

describe('DashTiendasComponent', () => {
  let component: DashTiendasComponent;
  let fixture: ComponentFixture<DashTiendasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashTiendasComponent]
    });
    fixture = TestBed.createComponent(DashTiendasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
