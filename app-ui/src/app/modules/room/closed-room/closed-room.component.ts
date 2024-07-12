import { Component, Input, OnInit } from '@angular/core';
import { RoomService, SummaryInstance } from '../room.service';
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
  @Input() summaries!: SummaryInstance[];
  fileContent: string | null = null;

  constructor(private http:HttpClient){}

  ngOnInit(): void {
  }
  
}
