import { MatLegacyProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatLegacyRadioModule } from '@angular/material/legacy-radio';
import { MatLegacyCardModule } from '@angular/material/legacy-card';
import { AsyncPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FlexModule } from '@angular/flex-layout';
import { Room } from 'src/app/modules/home/home.component';
import { RoomService } from 'src/app/modules/room/room.service';
import { FormsModule } from '@angular/forms';
import { RecordingService } from '../../services/recording.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-live-transcription-board',
  standalone: true,
  providers: [RoomService,RecordingService],
  imports: [FlexModule, MatLegacyCardModule, FormsModule, MatLegacyRadioModule, MatLegacyProgressBarModule, AsyncPipe],
  templateUrl: './live-transcription-board.component.html',
  styleUrl: './live-transcription-board.component.scss'
})
export class LiveTranscriptionBoardComponent implements OnInit{

  @Input() room!:Room;

  constructor(
  public roomService:RoomService,
  public recordingService: RecordingService,
  private route: ActivatedRoute
) { }

  ngOnInit(): void {

    this.recordingService.setTranscript(this.room.transcript || []);
    this.route.params.subscribe((params) => {
      this.roomService.connectToRoom(params.id || '');
      this.recordingService.liveTranscript$.subscribe((transcript) => {
        console.log(transcript);
        this.roomService.sendTranscript(params.id || '', transcript);
      });
    });
  }


}
