import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileShellComponent } from './mobile-shell.component';

describe('MobileShellComponent', () => {
  let component: MobileShellComponent;
  let fixture: ComponentFixture<MobileShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MobileShellComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
