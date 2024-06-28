import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryBoardComponent } from './summary-board.component';

describe('SummaryBoardComponent', () => {
  let component: SummaryBoardComponent;
  let fixture: ComponentFixture<SummaryBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryBoardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SummaryBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
