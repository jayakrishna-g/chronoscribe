import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { RoomService } from './room.service';
import { TranscriptInstance } from 'src/app/shared/services/recording.service';
import { Room, RoomMetaData } from '../home/home.component';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit {
  room!: Room;
  roomMetaData!: RoomMetaData;
  loggedInUser = 'user';
  transcripts!: TranscriptInstance[];

  constructor(
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    public roomService: RoomService
  ) {}

  ngOnInit(): void {
    this.room = JSON.parse(this.route.snapshot.data.room);
    this.transcripts = this.route.snapshot.data.transcripts;
    if (!this.transcripts) {
      this.transcripts = [];
    }
    this.roomMetaData = JSON.parse(this.route.snapshot.data.roomMetaData);
    this.loggedInUser = this.authService.getTokenData().email;
  }
}
