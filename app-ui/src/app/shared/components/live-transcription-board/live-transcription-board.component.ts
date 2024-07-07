import { AsyncPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RoomMetaData } from 'src/app/modules/home/home.component';
import { RoomService } from 'src/app/modules/room/room.service';
import { FormsModule } from '@angular/forms';
import { RecordingService } from '../../services/recording.service';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';

@Component({
  selector: 'app-live-transcription-board',
  standalone: true,
  providers: [RoomService, RecordingService],
  imports: [FormsModule, AsyncPipe],
  templateUrl: './live-transcription-board.component.html',
  styleUrl: './live-transcription-board.component.scss',
})
export class LiveTranscriptionBoardComponent implements OnInit {
  @Input() roomMetaData!: RoomMetaData;

  loggedInUser = 'user';

  constructor(
    public roomService: RoomService,
    public recordingService: RecordingService,
    private route: ActivatedRoute,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.authService.getTokenData().email;
    this.recordingService.setTranscript(this.roomMetaData.transcript || []);
    this.route.params.subscribe((params) => {
      this.roomService.connectToRoom(params.id || '');
      this.recordingService.liveTranscript$.subscribe((transcript) => {
        console.log(transcript);
        this.roomService.sendTranscript(params.id || '', transcript);
      });
    });
  }
}
