import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { RoomService } from './room.service';
import { RecordingService, TranscriptInstance } from 'src/app/shared/services/recording.service';
import { LayoutComponent } from 'src/app/shared/components/layout/layout.component';
import { LayoutItemComponent } from 'src/app/shared/components/layout-item/layout-item.component';
import { Room, RoomMetaData } from '../home/home.component';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { AdminRoomComponent } from './admin-room/admin-room.component';
import { JoinRoomComponent } from './join-room/join-room.component';
import { ClosedRoomComponent } from './closed-room/closed-room.component';
import { Router } from 'express';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
  providers: [RoomService, RecordingService],
  standalone: true,
  imports: [
    LayoutComponent,
    LayoutItemComponent,
    MatIconModule,
    RouterLink,
    AdminRoomComponent,
    JoinRoomComponent,
    ClosedRoomComponent,
  ],
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
