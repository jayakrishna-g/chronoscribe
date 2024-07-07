import { Component, Input, OnInit } from '@angular/core';
import { RoomMetaData } from 'src/app/modules/home/home.component';
import { FormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-room-details',
  standalone: true,
  imports: [FormsModule, AsyncPipe],
  templateUrl: './room-details.component.html',
  styleUrl: './room-details.component.scss',
})
export class RoomDetailsComponent implements OnInit {
  @Input() roomMetaData!: RoomMetaData;

  ngOnInit(): void {
    console.log(this.roomMetaData);
  }
}
