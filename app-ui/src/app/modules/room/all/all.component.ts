import { Component, OnInit } from '@angular/core';
import { Room } from '../../home/home.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-all',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.scss'],
})
export class AllComponent implements OnInit {
  rooms: Room[] = this.route.snapshot.data.rooms;
  filter(room: Room, filterString: string): boolean {
    return room.name.includes(filterString);
  }

  constructor(private route: ActivatedRoute) {
    this.rooms = this.route.snapshot.data.rooms.rooms;
    console.log('rooms', this.rooms);
  }

  ngOnInit(): void {}
}
