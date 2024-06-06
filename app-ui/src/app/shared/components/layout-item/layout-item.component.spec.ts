import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutItemComponent } from './layout-item.component';

describe('LayoutItemComponent', () => {
  let component: LayoutItemComponent;
  let fixture: ComponentFixture<LayoutItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LayoutItemComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
