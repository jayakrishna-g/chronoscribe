import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Room } from '../../home/home.component';
import { RoomService } from '../room.service';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { DisplayDetailsComponent } from 'src/app/shared/components/display-details/display-details.component';
import { QuizQuestion } from '../room.component';
import { BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatLegacyProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatLegacyRadioModule } from '@angular/material/legacy-radio';
import { FormsModule } from '@angular/forms';
import { MatLegacyCardModule } from '@angular/material/legacy-card';
import { FlexModule } from '@angular/flex-layout/flex';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.scss'],
  providers: [RoomService],
  standalone: true,
  imports: [FlexModule, MatLegacyCardModule, FormsModule, MatLegacyRadioModule, MatLegacyProgressBarModule, AsyncPipe],
})
export class JoinRoomComponent implements OnInit, OnDestroy, AfterViewChecked {
  room: Room = this.route.snapshot.data.room;
  quiz_question = new BehaviorSubject<QuizQuestion | null>(null);
  selected_option!: string;
  timeLeft = new BehaviorSubject<number>(60);
  question!: string;
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;
  @ViewChild('quizdialog') question_dialog!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    public roomService: RoomService,
    private authService: AuthenticationService,
    private router: Router,
    private matDialog: MatDialog,
    private toastService: ToastrService
  ) {}

  ngOnInit(): void {
    this.room = this.route.snapshot.data.room;
    let owner = this.room.owner;
    let user = this.authService.getTokenData().email;
    if (owner === user) {
      this.router.navigate(['room', this.room.room_id]);
    }
    this.roomService.setSummary(this.room.summaries || []);
    if (this.room.transcript) {
      console.log(this.room.transcript);
      this.roomService.setTranscript(this.room.transcript);
    }
    this.route.params.subscribe((params) => {
      this.roomService.connectToRoom(params.id || '');
    });
    this.scrollToBottom();
    this.subscribeToQuestions();
  }

  subscribeToQuestions() {
    this.roomService.quizQuestion$.subscribe((question) => {
      if (question) {
        this.quiz_question.next(question);
        this.matDialog.open(DisplayDetailsComponent, {
          data: {
            template: this.question_dialog,
          },
        });
        this.close_dialog_in(60);
      }
    });
  }

  close_dialog_in(seconds: number) {
    setTimeout(() => {
      this.matDialog.closeAll();
    }, seconds * 1000);

    let interval = setInterval(() => {
      this.timeLeft.next(this.timeLeft.value - 1);
      if (this.timeLeft.value === 0) {
        clearInterval(interval);
      }
    }, 1000);
  }

  askQuestion() {
    this.roomService.sendQuestion(this.room.room_id || '', this.question);
    this.question = '';
    this.toastService.success('Question sent');
  }

  submitQuiz() {
    this.matDialog.closeAll();
    console.log(this.selected_option);
    this.roomService.sendQuickQuestionAnswer(
      this.room.room_id || '',
      this.quiz_question.value?.options.findIndex((option) => option === this.selected_option)
    );
    this.toastService.success('Answer submitted');
  }

  ngOnDestroy(): void {
    this.roomService.disconnect();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  emojiClick(emoji: string) {
    this.roomService.sendEmoji(this.room.room_id || '', emoji);
  }
}
