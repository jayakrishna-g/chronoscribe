import { Component, Input, OnInit } from '@angular/core';
import { RoomMetaData } from 'src/app/modules/home/home.component';
import { RoomService } from 'src/app/modules/room/room.service';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-summary-board',
  standalone: true,
  imports: [MatIconModule, FormsModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './summary-board.component.html',
  styleUrl: './summary-board.component.scss',
})
export class SummaryBoardComponent implements OnInit {
  @Input() roomMetaData!: RoomMetaData;

  constructor(public roomService: RoomService) {}

  ngOnInit(): void {
    this.roomService.setSummary(this.roomMetaData.summaries || []);
  }
}
