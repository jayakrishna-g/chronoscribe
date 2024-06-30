import { MatLegacyProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatLegacyRadioModule } from '@angular/material/legacy-radio';
import { MatLegacyCardModule } from '@angular/material/legacy-card';
import { Component, Input, OnInit } from '@angular/core';
import { FlexModule } from '@angular/flex-layout';
import { Room } from 'src/app/modules/home/home.component';
import { FormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-room-details',
  standalone: true,
  imports: [FlexModule, MatLegacyCardModule, FormsModule, MatLegacyRadioModule, MatLegacyProgressBarModule, AsyncPipe],
  templateUrl: './room-details.component.html',
  styleUrl: './room-details.component.scss',
})
export class RoomDetailsComponent implements OnInit {
  @Input() room!: Room;

  ngOnInit(): void {
    console.log(this.room);
  }
}
