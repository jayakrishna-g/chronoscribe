import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveTranscriptionBoardComponent } from './live-transcription-board.component';

describe('LiveTranscriptionBoardComponent', () => {
  let component: LiveTranscriptionBoardComponent;
  let fixture: ComponentFixture<LiveTranscriptionBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveTranscriptionBoardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiveTranscriptionBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
