import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { LiveTranscriptionBoardComponent } from 'src/app/shared/components/live-transcription-board/live-transcription-board.component';
import { RoomDetailsComponent } from 'src/app/shared/components/room-details/room-details.component';
import { SummaryBoardComponent } from 'src/app/shared/components/summary-board/summary-board.component';
import { RoomService } from '../room.service';
import { Room, RoomMetaData } from '../../home/home.component';

@Component({
  selector: 'app-closed-room',
  standalone: true,
  providers: [RoomService],
  imports: [MatCardModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    AsyncPipe,
    RoomDetailsComponent,
    LiveTranscriptionBoardComponent,
    SummaryBoardComponent,
    NgTemplateOutlet,],
  templateUrl: './closed-room.component.html',
  styleUrl: './closed-room.component.scss'
})
export class ClosedRoomComponent {
  @Input() room!: Room;
  @Input() roomMetaData!: RoomMetaData;


}
