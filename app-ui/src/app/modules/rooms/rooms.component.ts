import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { RoomActivity } from '../resolvers/rooms.resolver';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.scss',
})
export class RoomsComponent implements OnInit {
  roomActivities = new BehaviorSubject<RoomActivity[]>([]);
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.roomActivities.next(this.route.snapshot.data.rooms);
  }
}
