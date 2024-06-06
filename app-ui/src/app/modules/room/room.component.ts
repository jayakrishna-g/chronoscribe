import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Room } from '../home/home.component';
import { RecordingService } from 'src/app/shared/services/recording.service';
import { RoomService } from './room.service';
import { MatDialog } from '@angular/material/dialog';
import { DisplayDetailsComponent } from 'src/app/shared/components/display-details/display-details.component';
import { Form, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

export type QuizQuestion = {
  question: string;
  options: string[];
};

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
  providers: [RoomService, RecordingService],
})
export class RoomComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;
  @ViewChild('template') template!: TemplateRef<any>;
  @ViewChild('questionsdialog') question_dialog!: TemplateRef<any>;

  isRecording: boolean = false;
  room!: Room;
  quickQuestionForm!: FormGroup;
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

  startRecording(): void {
    this.isRecording = true;
    this.recordingService.startRecording();
  }

  stopRecording(): void {
    console.log('stop recording');
    this.isRecording = false;
    this.recordingService.stopRecording();
  }

  addOption(): void {
    const options = this.quickQuestionForm.get('options') as FormArray;
    options.push(new FormControl('', Validators.required));
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

  quizOptions(): FormControl[] {
    let formArray = this.quickQuestionForm.get('options') as FormArray;
    return formArray.controls as FormControl[];
  }

  initQuizQuestionsForm(): void {
    this.quickQuestionForm = new FormGroup({
      question: new FormControl('', Validators.required),
      options: new FormArray([]),
    });
  }
}
