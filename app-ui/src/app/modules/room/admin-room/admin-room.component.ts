import {
  AfterViewChecked,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecordingService, TranscriptInstance } from 'src/app/shared/services/recording.service';
import { FormControl, UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, interval } from 'rxjs';
import { RoomService, SummaryInstance } from '../room.service';
import { Room, RoomMetaData } from '../../home/home.component';
import { MatDialog } from '@angular/material/dialog';
import { DisplayDetailsComponent } from 'src/app/shared/components/display-details/display-details.component';
import { skip } from 'rxjs/operators';
import languages, {
  getLanguageByCode,
  getUniqueLanguages,
  Language,
  getRegionsByLanguageCode,
} from 'src/app/shared/services/languags';

export type QuizQuestion = {
  question: string;
  options: string[];
};

@Component({
  selector: 'app-admin-room',
  templateUrl: './admin-room.component.html',
  styleUrls: ['./admin-room.component.scss'],
  providers: [RecordingService],
})
export class AdminRoomComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;
  @ViewChild('template') template!: TemplateRef<any>;
  @ViewChild('questionsdialog') question_dialog!: TemplateRef<any>;
  @ViewChild('exitroomdialog') exitroom_dialog!: TemplateRef<any>;
  @Input() room!: Room;
  @Input() roomMetaData!: RoomMetaData;
  @Input() transcripts!: TranscriptInstance[];
  @Input() summaries!: SummaryInstance[];

  isRecording: boolean = false;
  quickQuestionForm!: UntypedFormGroup;
  quizQuestion = new BehaviorSubject<QuizQuestion | null>(null);
  timeOut = 500000;
  collectedTranscripts: TranscriptInstance[] = [];
  startIndex = this.transcripts?.length || 0;
  supportedLanguages$ = new BehaviorSubject<Language[]>([]);
  supportedRegions$ = new BehaviorSubject<Language[]>([]);

  language = new FormControl<string>('en-US');
  region = new FormControl<string>('en-US');

  constructor(
    private route: ActivatedRoute,
    public recordingService: RecordingService,
    public roomService: RoomService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.roomService.setTranscript(this.transcripts);
    this.roomService.setSummary(this.summaries);
    this.startIndex = this.transcripts?.length || 0;
    this.recordingService.setTranscript(this.transcripts);
    this.route.params.subscribe((params) => {
      this.roomService.connectToRoom(params.id || '');
      this.recordingService.liveTranscript$.subscribe((transcript) => {
        this.roomService.sendTranscript(params.id || '', transcript);
      });
    });

    this.initQuizQuestionsForm();
    this.scrollToBottom();
    interval(this.timeOut)
      // .pipe(skip(1))
      .subscribe(() => {
        let startIndex = this.startIndex;
        let endIndex = this.recordingService.transcript.value.length;
        console.log(startIndex, endIndex);
        if (startIndex === endIndex) return;
        this.startIndex = endIndex;
        this.roomService.collectSummary(this.room.id || '', startIndex, endIndex);
      });


    let language = navigator.language || 'en-US';
    // alert(language);
    this.supportedLanguages$.next(getUniqueLanguages());
    this.supportedRegions$.next(getRegionsByLanguageCode(language));
    this.region.setValue(language);
    this.language.setValue(language);
    this.onLanguageChange(language);
    this.language.valueChanges.subscribe((language) => {
      if(this.region.value !== language) {
        this.region.setValue(language);
        this.onLanguageChange(language || 'en-US');
      }
    });

    this.region.valueChanges.subscribe((region) => {
      if(this.language.value !== region) {
        this.language.setValue(region);
        this.onLanguageChange(region || 'en-US');
      }
    });

  }

  onLanguageChange(language: string) {
    // alert(language);
    this.recordingService.setLanguage(language);
    this.supportedRegions$.next(getRegionsByLanguageCode(language));
  }

  ngOnDestroy(): void {
    this.roomService.disconnect();
  }
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  questions() {
    this.dialog.open(DisplayDetailsComponent, {
      data: {
        template: this.question_dialog,
      },
    });
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  quickQuestion(): void {
    this.quizQuestion.next(null);
    this.dialog.open(DisplayDetailsComponent, {
      data: {
        template: this.template,
      },
    });
  }

  createFile(transcripts: any): string {
    let finalString = '';
    for (let i = 0; i < transcripts.length; i++) {
      finalString = finalString + transcripts[i].content;
    }
    return finalString;
  }

  closeRoom() {
    console.log('exit');

    const dialogRef = this.dialog.open(DisplayDetailsComponent, {
      data: {
        template: this.exitroom_dialog,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      //this.room.is_active = false;

      if (result === 'continue') {
        let file = new Blob([this.createFile(this.transcripts)], { type: 'text/plain' });
        this.roomService.saveFile(file, this.room.id).subscribe((res) => {
          console.log(res.status);
          if (res.status === 'success') {
            this.roomService.closeRoomService(this.room.id);
          }
        });
      }
      console.log('The dialog was closed');
    });
    this.roomService.closedRoomFlag$.subscribe((data) => {
      if (data) {
        window.location.reload();
      }
    });
  }

  resetEmoji(): void {
    this.roomService.resetEmoji();
  }

  toggleRecording(): void {
    if (this.isRecording) {
      this.recordingService.stopRecording();
    } else {
      this.recordingService.startRecording();
    }

    this.isRecording = !this.isRecording;
  }

  stopRecording(): void {
    console.log('stop recording');
    this.isRecording = false;
    this.recordingService.stopRecording();
  }

  addOption(): void {
    const options = this.quickQuestionForm.get('options') as UntypedFormArray;
    options.push(new UntypedFormControl('', Validators.required));
  }

  askQuestion(): void {
    if (this.quickQuestionForm.valid) {
      const question: QuizQuestion = {
        question: this.quickQuestionForm.controls['question'].value,
        options: this.quickQuestionForm.controls['options'].value,
      };
      console.log(question);
      this.roomService.sendQuickQuestion(this.room.id || '', question);
      this.quizQuestion.next(question);
      this.quickQuestionForm.reset();
    }
  }

  quizOptions(): UntypedFormControl[] {
    let formArray = this.quickQuestionForm.get('options') as UntypedFormArray;
    return formArray.controls as UntypedFormControl[];
  }

  initQuizQuestionsForm(): void {
    this.quickQuestionForm = new UntypedFormGroup({
      question: new UntypedFormControl('', Validators.required),
      options: new UntypedFormArray([]),
    });
  }
}
