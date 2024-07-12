import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RoomDetailsComponent } from 'src/app/shared/components/room-details/room-details.component';
import { SummaryBoardComponent } from 'src/app/shared/components/summary-board/summary-board.component';
import { RoomService } from '../room.service';
import { Room, RoomMetaData } from '../../home/home.component';
import { TranscriptInstance } from 'src/app/shared/services/recording.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-closed-room',
  templateUrl: './closed-room.component.html',
  styleUrl: './closed-room.component.scss',
})
export class ClosedRoomComponent implements OnInit{

  @Input() room!: Room;
  @Input() roomMetaData!: RoomMetaData;
  @Input() transcripts!: TranscriptInstance[];
  fileContent: string | null = null;

  constructor(private http:HttpClient){}

  ngOnInit(): void {
  }
  
}
