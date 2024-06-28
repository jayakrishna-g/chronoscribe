import { Injectable } from '@angular/core';
import { SpeechRecognitionService, continuous } from '@ng-web-apis/speech';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { repeat, retry, takeUntil } from 'rxjs/operators';

export interface TranscriptInstance {
  content: string;
  index: number;
}

@Injectable({
  providedIn: 'any',
})
export class RecordingService {
  transcript = new BehaviorSubject<TranscriptInstance[]>([]);
  stopRecording$ = new Subject<boolean>();
  liveTranscript = new BehaviorSubject<TranscriptInstance>({ content: '', index: 0 });
  initialLength = 0;
  constructor(private speechRecognition$: SpeechRecognitionService) {
    this.liveTranscript.subscribe((live) => {
      if (this.transcript.value.length > live.index) {
        this.transcript.value[live.index] = live;
      } else {
        this.transcript.value.push(live);
      }
    });
  }
  startRecording(): void {
    // Create a new instance of SpeechRecognition
    this.speechRecognition$
      .pipe(retry(), repeat(), continuous(), takeUntil(this.stopRecording$.asObservable()))
      .subscribe((event) => {
        this.liveTranscript.next({
          content: event[event.length - 1].item(0).transcript,
          index: this.initialLength + event.length - 1,
        });
      });
  }

  stopRecording(): void {
    this.stopRecording$.next(true);
  }

  setTranscript(transcript: TranscriptInstance[]): void {
    this.transcript.next(transcript);
    this.initialLength = transcript.length;
  }

  get transcript$(): Observable<TranscriptInstance[]> {
    return this.transcript.asObservable();
  }

  get liveTranscript$(): Observable<TranscriptInstance> {
    return this.liveTranscript.asObservable();
  }

  get summary$(): Observable<string[]> {
    return of(['Summary']);
  }
}
