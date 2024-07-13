import { Injectable } from '@angular/core';
import { SpeechRecognitionService, continuous } from '@ng-web-apis/speech';
import { BehaviorSubject, Observable, Subject, from, of, combineLatest } from 'rxjs';
import { catchError, map, mergeMap, repeat, retry, switchMap, takeUntil } from 'rxjs/operators';

export interface TranscriptInstance {
  content: string;
  index: number;
}

export interface LiveTranscriptInstance extends TranscriptInstance {
  isFinal: boolean;
}

export interface TranslatedTranscript extends TranscriptInstance {
  translatedContent: string;
}

@Injectable()
export class RecordingService {
  transcript = new BehaviorSubject<TranscriptInstance[]>([]);
  stopRecording$ = new Subject<boolean>();
  liveTranscript = new Subject<LiveTranscriptInstance>();
  initialLength = 0;
  private language$ = new BehaviorSubject<string>('en-US');

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
    this.language$
      .pipe(
        switchMap((lang) => this.createSpeechRecognition(lang)),
        takeUntil(this.stopRecording$)
      )
      .subscribe();
  }

  private createSpeechRecognition(language: string): Observable<SpeechRecognitionResult[]> {
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    return new Observable<SpeechRecognitionResult[]>((observer) => {
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        observer.next(Array.from(event.results));
        const lastResult = event.results[event.results.length - 1];
        this.liveTranscript.next({
          content: lastResult[0].transcript,
          index: this.initialLength + event.results.length - 1,
          isFinal: lastResult.isFinal,
        });
      };

      recognition.onerror = (error: SpeechRecognitionErrorEvent) => {
        observer.error(error);
      };

      recognition.onend = () => {
        observer.complete();
      };

      recognition.start();

      return () => {
        recognition.stop();
      };
    }).pipe(retry(), repeat());
  }

  stopRecording(): void {
    this.stopRecording$.next(true);
  }

  setTranscript(transcript: TranscriptInstance[]): void {
    this.transcript.next(transcript);
    this.initialLength = transcript.length;
  }

  setLanguage(language: string): void {
    this.language$.next(language);
  }

  get transcript$(): Observable<TranscriptInstance[]> {
    return this.transcript.asObservable();
  }

  get liveTranscript$(): Observable<LiveTranscriptInstance> {
    return this.liveTranscript.asObservable();
  }

  get summary$(): Observable<string[]> {
    return of(['Summary']);
  }

  get currentLanguage$(): Observable<string> {
    return this.language$.asObservable();
  }
}
