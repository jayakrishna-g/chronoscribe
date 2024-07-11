import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RoomService, SummaryInstance } from '../room.service';
import { Room, RoomMetaData } from '../../home/home.component';
import { TranscriptInstance } from 'src/app/shared/services/recording.service';

@Component({
  selector: 'app-closed-room',
  templateUrl: './closed-room.component.html',
  styleUrl: './closed-room.component.scss',
})
export class ClosedRoomComponent {
  @Input() room!: Room;
  @Input() roomMetaData!: RoomMetaData;
  @Input() transcripts!: TranscriptInstance[];
  @Input() summaries!: SummaryInstance[];
}
