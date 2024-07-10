import { Injectable } from '@angular/core';
import { SpeechRecognitionService, continuous } from '@ng-web-apis/speech';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { repeat, retry, takeUntil } from 'rxjs/operators';

export interface TranscriptInstance {
  content: string;
  index: number;
}

export interface LiveTranscriptInstance {
  content: string;
  index: number;
  isFinal: boolean;
}

@Injectable()
export class RecordingService {
  transcript = new BehaviorSubject<TranscriptInstance[]>([]);
  stopRecording$ = new Subject<boolean>();
  liveTranscript = new Subject<LiveTranscriptInstance>();
  initialLength = 0;
  constructor(private speechRecognition$: SpeechRecognitionService) {
    this.liveTranscript.subscribe((live) => {
      console.warn(live);
      console.warn(this.transcript.value);
      let len = this.transcript.value.length;
      if (len === 0) {
        this.transcript.value.push(live);
        return;
      }

      if (live.isFinal) {
        if (this.transcript.value[len - 1].index === live.index) {
          this.transcript.value[live.index] = live;
        } else if (this.transcript.value[len - 1].index < live.index) {
          this.transcript.value.push(live);
        } else {
          this.transcript.value[live.index].content = live.content;
          for (let i = live.index + 1; i < len; i++) {
            this.transcript.value[i].content = '';
          }
        }
      } else {
        this.transcript.value[live.index] = live;
      }
    });
  }
  startRecording(): void {
    // Create a new instance of SpeechRecognition
    this.speechRecognition$
      .pipe(retry(), repeat(), continuous(), takeUntil(this.stopRecording$.asObservable()))
      .subscribe((event) => {
        console.log(event);
        this.liveTranscript.next({
          content: event[event.length - 1].item(0).transcript,
          index: this.initialLength + event.length - 1,
          isFinal: event[event.length - 1].isFinal,
        });
      });
  }

  stopRecording(): void {
    this.stopRecording$.next(true);
  }

  setTranscript(transcript: TranscriptInstance[]): void {
    this.transcript.next(transcript);
    this.initialLength = transcript.length;
    console.log(this.transcript.value);
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
