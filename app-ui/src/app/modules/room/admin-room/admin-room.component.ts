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
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { RoomService } from '../room.service';
import { Room, RoomMetaData } from '../../home/home.component';
import { MatDialog } from '@angular/material/dialog';
import { DisplayDetailsComponent } from 'src/app/shared/components/display-details/display-details.component';

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

  isRecording: boolean = false;
  quickQuestionForm!: UntypedFormGroup;
  quizQuestion = new BehaviorSubject<QuizQuestion | null>(null);
  constructor(
    private route: ActivatedRoute,
    public recordingService: RecordingService,
    public roomService: RoomService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.roomService.setTranscript(this.transcripts);
    this.recordingService.setTranscript(this.transcripts);
    this.route.params.subscribe((params) => {
      this.roomService.connectToRoom(params.id || '');
      this.recordingService.liveTranscript$.subscribe((transcript) => {
        console.log(transcript);
        this.roomService.sendTranscript(params.id || '', transcript);
      });
    });
    this.initQuizQuestionsForm();
    this.scrollToBottom();
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

  closeRoom() {
    console.log('exit');

    const dialogRef = this.dialog.open(DisplayDetailsComponent, {
      data: {
        template: this.exitroom_dialog,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      //this.room.is_active = false;
      console.log(result);
      if (result === 'continue') {
        this.roomService.closeRoomService(this.room.id);
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
