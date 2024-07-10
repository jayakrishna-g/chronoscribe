import { AfterViewChecked, Component, ElementRef, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Room, RoomMetaData } from '../../home/home.component';
import { RoomService } from '../room.service';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { DisplayDetailsComponent } from 'src/app/shared/components/display-details/display-details.component';
import { BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { QuizQuestion } from '../admin-room/admin-room.component';
import { RoomDetailsComponent } from 'src/app/shared/components/room-details/room-details.component';
import { LiveTranscriptionBoardComponent } from 'src/app/shared/components/live-transcription-board/live-transcription-board.component';
import { SummaryBoardComponent } from 'src/app/shared/components/summary-board/summary-board.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.scss'],
  providers: [RoomService],
  standalone: true,
  imports: [
    FormsModule,
    MatRadioModule,
    MatProgressBarModule,
    MatDialogModule,
    AsyncPipe,
    RoomDetailsComponent,
    LiveTranscriptionBoardComponent,
    SummaryBoardComponent,
    NgTemplateOutlet,
  ],
})
export class JoinRoomComponent implements OnInit, OnDestroy, AfterViewChecked {
  quiz_question = new BehaviorSubject<QuizQuestion | null>(null);
  selected_option!: string;
  timeLeft = new BehaviorSubject<number>(60);
  question!: string;
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;
  @ViewChild('quizdialog') question_dialog!: ElementRef;
  @ViewChild('exitroomredirectdialog') exitroomredirect_dialog!: TemplateRef<any>;
  @Input() room!: Room;
  @Input() roomMetaData!: RoomMetaData;
  private initialLoad = true;

  constructor(
    private route: ActivatedRoute,
    public roomService: RoomService,
    private authService: AuthenticationService,
    private router: Router,
    private matDialog: MatDialog,
    private toastService: ToastrService
  ) {}

  ngOnInit(): void {
    let owner = this.roomMetaData.owner_id;
    let user = this.authService.getTokenData().email;
    if (owner === user) {
      this.router.navigate(['room', this.room.id]);
    }
    this.roomService.setSummary(this.roomMetaData.summaries || []);
    if (this.roomMetaData.transcript) {
      console.log(this.roomMetaData.transcript);
      this.roomService.setTranscript(this.roomMetaData.transcript);
    }
    this.route.params.subscribe((params) => {
      this.roomService.connectToRoom(params.id || '');
    });
    this.roomService.closedRoomFlag$.subscribe((data)=>{
      if (this.initialLoad) {
        this.initialLoad = false;
        return;
      }
      const dialogRef = this.matDialog.open(DisplayDetailsComponent, {
        data: {
          template: this.exitroomredirect_dialog,
        },
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        if(result === "home"){
          this.router.navigate(["home"]);
        } else {
          window.location.reload();
        }
        console.log('The dialog was closed');
      });
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
    this.roomService.sendQuestion(this.room.id || '', this.question);
    this.question = '';
    this.toastService.success('Question sent');
  }

  submitQuiz() {
    this.matDialog.closeAll();
    console.log(this.selected_option);
    this.roomService.sendQuickQuestionAnswer(
      this.room.id || '',
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
    this.roomService.sendEmoji(this.room.id || '', emoji);
  }
}
