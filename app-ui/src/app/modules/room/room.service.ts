import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Room, RoomMetaData } from '../home/home.component';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { TranscriptInstance } from 'src/app/shared/services/recording.service';
import { WebSocketSubject, webSocket as websocket } from 'rxjs/webSocket';
import { webSocket } from 'rxjs/webSocket';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { QuizQuestion } from './admin-room/admin-room.component';
import { RoomActivity } from '../resolvers/rooms.resolver';

export type RoomSocketData = {
  transcript_content: string;
  transcript_index: number;
};

export type Emoji = {
  emoji?: string;
  count?: number;
};

export type QuizStat = {
  option: number;
  count: number;
  percentage?: number;
};

export type SummaryInstance = {
  content: string;
  timestamp: string;
};

@Injectable({
  providedIn: 'any',
})
export class RoomService {
  private websocket$!: WebSocketSubject<any>;
  transcript_listener = new BehaviorSubject<TranscriptInstance[]>([]);
  summary_listener = new BehaviorSubject<SummaryInstance[]>([]);
  emoji_listener = new BehaviorSubject<Emoji[]>([
    {
      emoji: '😀',
      count: 0,
    },
    {
      emoji: '😑',
      count: 0,
    },
    {
      emoji: '☹️',
      count: 0,
    },
  ]);
  quizQuestion_listener = new BehaviorSubject<QuizQuestion | null>(null);
  quizStats_listener = new BehaviorSubject<QuizStat[]>([]);
  questions_listener = new BehaviorSubject<string[]>([]);
  closedRoomFlag = new BehaviorSubject<boolean>(false);
  unreadQuestions = new BehaviorSubject<number>(0);
  constructor(private http: HttpClient, private authService: AuthenticationService) {}

  handleWebsocketData(data: any) {
    if (!data?.status) return;
    if (data?.type !== 'broadcast') return;
    let body = data.body;
    switch (body.service) {
      case 'transcript':
        this.handleTranscript(body.message);
        break;
      case 'summary':
        this.handleSummary(body.message);
        break;
      case 'emoji':
        this.handleEmoji(body.message);
        break;
      case 'quick_question':
        this.handleQuickQuestion(body.message);
        break;
      case 'quick_question_answer':
        this.handleQuickQuestionAnswer(body.message);
        break;
      case 'question':
        this.handleQuestion(body.message);
        break;
      case 'closeRoom':
        this.handleCloseRoom(body.message);
        break;
      default:
        break;
    }
  }
  handleCloseRoom(data: any) {
    this.closedRoomFlag.next(data);
  }

  handleQuestion(data: { question: string }) {
    let currentQuestions = this.questions_listener.value;
    currentQuestions.push(data.question);
    let unread = this.unreadQuestions.value;
    this.unreadQuestions.next(unread + 1);
    this.questions_listener.next(currentQuestions);
  }

  handleQuickQuestionAnswer(data: any) {
    if (!data) return;
    let currentStats = this.quizStats_listener.value;
    let index = currentStats.findIndex((stat) => stat.option === data.answer);
    if (index >= 0) {
      currentStats[index].count = (currentStats[index].count || 0) + 1;
    }
    let tot = 0;
    currentStats.forEach((stat) => {
      tot += stat.count;
    });
    // console.log(tot);
    currentStats.forEach((stat) => {
      stat.percentage = (stat.count / tot) * 100;
    });

    this.quizStats_listener.next(currentStats);
  }

  handleQuickQuestion(data: QuizQuestion) {
    // console.log(data);
    this.quizQuestion_listener.next(data);
  }

  handleEmoji(data: any) {
    if (!data) return;
    if (data['emoji']) {
      let currentEmoji = this.emoji_listener.value;
      let emoji = data['emoji'];
      let index = currentEmoji.findIndex((e) => e.emoji === emoji);
      if (index >= 0) {
        currentEmoji[index].count = (currentEmoji[index].count || 0) + 1;
      } else {
        currentEmoji.push({ emoji, count: 1 });
      }
    }
  }

  handleSummary(data: string) {
    let currentSummary = this.summary_listener.value;
    currentSummary.push({ content: data, timestamp: Date.now().toString() });
    this.summary_listener.next(currentSummary);
  }

  handleTranscript(data: TranscriptInstance) {
    console.log(data);
    let currentTranscript = this.transcript_listener.value;
    if (!currentTranscript) currentTranscript = [];
    let len = currentTranscript.length;
    // console.log(currentTranscript);
    if (len === 0) {
      currentTranscript.push(data);
    } else if (currentTranscript[len - 1].index == data.index) {
      currentTranscript[data.index] = data;
    } else if (currentTranscript[len - 1].index < data.index) {
      currentTranscript.push(data);
    } else {
      console.error('Index mismatch');
      currentTranscript[data.index].content = data.content;
    }
    this.transcript_listener.next(currentTranscript);
  }

  contactRoomService(roomId: string, service: string, data: any) {
    this.websocket$.next({
      room_id: roomId,
      service: service,
      body: {
        user: this.authService.getTokenData().email,
        ...data,
      },
    });
  }

  getTranscript(roomId: string) {
    return this.http.get<TranscriptInstance[]>(`/api/room/transcript/${roomId}`);
  }

  closeRoomService(roomId: string) {
    this.contactRoomService(roomId, 'close_room', {});
  }

  collectSummary(roomId: string, start: number, end: number) {
    this.contactRoomService(roomId, 'summary', { start, end });
  }

  resetUnreadQuestions() {
    this.unreadQuestions.next(0);
  }

  resetEmoji() {
    this.emoji_listener.next([
      {
        emoji: '😀',
        count: 0,
      },
      {
        emoji: '😑',
        count: 0,
      },
      {
        emoji: '☹️',
        count: 0,
      },
    ]);
  }

  get transcript$() {
    console.log(this.transcript_listener.value);
    return this.transcript_listener.asObservable();
  }

  get summary$() {
    return this.summary_listener.asObservable();
  }

  get emoji$() {
    return this.emoji_listener.asObservable();
  }

  get quizQuestion$() {
    return this.quizQuestion_listener.asObservable();
  }

  get quizStats$() {
    return this.quizStats_listener.asObservable();
  }

  get questions$() {
    return this.questions_listener.asObservable();
  }

  get unreadQuestions$() {
    return this.unreadQuestions.asObservable();
  }

  get closedRoomFlag$() {
    return this.closedRoomFlag.asObservable();
  }

  getRoomMetaData(roomId: string) {
    return this.http.get<RoomMetaData>(`/api/room/meta/${roomId}`);
  }

  getRoomData(roomId: string) {
    return this.http.get<Room>(`/api/room/data/${roomId}`);
  }

  saveFile(file: Blob, roomId: string) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`/api/room/file/${roomId}`, formData);
  }

  getRooms() {
    let owner = this.authService.getTokenData().email;
    return this.http.get<RoomMetaData[]>(`/api/room/all/${owner}`);
  }

  getSummary(roomId: string) {
    return this.http.get<SummaryInstance[]>(`/api/room/summary/${roomId}`);
  }

  getRoomActivityData() {
    return this.http.get<RoomActivity[]>(`/api/room/all`);
  }

  connectToRoom(roomId: string) {
    let url = `ws://${window.location.hostname}:4200/ws/room/${roomId}`;
    if (environment.production) {
      url = `ws://${window.location.hostname}/ws/room/${roomId}`;
    }
    this.websocket$ = websocket(url);
    this.websocket$.subscribe((data) => {
      // console.log(data);
      this.handleWebsocketData(data);
    });
  }

  sendEmoji(room_id: string, emoji: string) {
    this.contactRoomService(room_id, 'emoji', { emoji });
  }

  sendQuickQuestion(room_id: string, question: QuizQuestion) {
    this.quizStats_listener.next(question.options.map((option, index) => ({ option: index, count: 0 })));
    this.contactRoomService(room_id, 'quick_question', question);
  }

  sendQuickQuestionAnswer(room_id: string, answer: number | any) {
    // console.log(answer);
    if (answer !== null || answer !== undefined)
      this.contactRoomService(room_id, 'quick_question_answer', { answer: answer });
  }

  sendQuestion(room_id: string, question: string) {
    this.contactRoomService(room_id, 'question', { question });
  }

  setTranscript(transcript: TranscriptInstance[]) {
    console.log(transcript);
    if (!transcript) return;
    this.transcript_listener.next(transcript);
  }

  setSummary(summary: SummaryInstance[]) {
    console.log(summary);
    if (!summary) return;
    this.summary_listener.next(summary);
  }

  disconnect() {
    this.websocket$.complete();
  }

  getRoomDetailsSocket(roomId: string) {}

  sendTranscript(roomId: string, transcript: TranscriptInstance) {
    this.contactRoomService(roomId, 'transcript', transcript);
    // this.websocket$.next({
    //   type: 'transcript',
    //   room_id: roomId,
    //   transcript_content: transcript.transcript_content,
    //   transcript_index: transcript.transcript_index,
    //   service: 'room',
    // });
  }
}
