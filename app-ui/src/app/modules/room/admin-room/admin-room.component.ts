import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecordingService } from 'src/app/shared/services/recording.service';
import {
  Form,
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { RoomService } from '../room.service';
import { Room } from '../../home/home.component';
import { RoomDetailsComponent } from 'src/app/shared/components/room-details/room-details.component';
import { SummaryBoardComponent } from 'src/app/shared/components/summary-board/summary-board.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
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
  providers: [RoomService],
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    AsyncPipe,
    RoomDetailsComponent,
    SummaryBoardComponent,
    NgTemplateOutlet,
  ],
})
export class AdminRoomComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;
  @ViewChild('template') template!: TemplateRef<any>;
  @ViewChild('questionsdialog') question_dialog!: TemplateRef<any>;

  isRecording: boolean = false;
  room!: Room;
  quickQuestionForm!: UntypedFormGroup;
  quizQuestion = new BehaviorSubject<QuizQuestion | null>(null);
  constructor(
    private route: ActivatedRoute,
    public recordingService: RecordingService,
    public roomService: RoomService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.room = this.route.snapshot.data.room;
    this.roomService.setTranscript(this.room.transcript || []);
    this.recordingService.setTranscript(this.room.transcript || []);
    this.roomService.setSummary(this.room.summaries || []);
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
      this.roomService.sendQuickQuestion(this.room.room_id || '', question);
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
