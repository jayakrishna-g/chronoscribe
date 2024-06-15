import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NormalShellComponent } from './normal-shell.component';

describe('NormalShellComponent', () => {
  let component: NormalShellComponent;
  let fixture: ComponentFixture<NormalShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [NormalShellComponent],
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NormalShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
