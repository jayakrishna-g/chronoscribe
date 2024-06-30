import { MatLegacyInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyCardModule } from '@angular/material/legacy-card';
import { Component, Input, OnInit } from '@angular/core';
import { FlexModule } from '@angular/flex-layout';
import { Room } from 'src/app/modules/home/home.component';
import { RoomService } from 'src/app/modules/room/room.service';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-summary-board',
  standalone: true,
  imports: [
    FlexModule,
    MatLegacyCardModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatLegacyFormFieldModule,
    MatLegacyInputModule,
    AsyncPipe,
  ],
  templateUrl: './summary-board.component.html',
  styleUrl: './summary-board.component.scss',
})
export class SummaryBoardComponent implements OnInit {
  @Input() room!: Room;

  constructor(public roomService: RoomService) {}

  ngOnInit(): void {
    this.roomService.setSummary(this.room.summaries || []);
  }
}
