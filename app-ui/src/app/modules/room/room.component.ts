import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { RoomService } from './room.service';
import { RecordingService } from 'src/app/shared/services/recording.service';
import { LayoutComponent } from 'src/app/shared/components/layout/layout.component';
import { LayoutItemComponent } from 'src/app/shared/components/layout-item/layout-item.component';
import { Room } from '../home/home.component';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
  providers: [RoomService, RecordingService],
  standalone: true,
  imports: [LayoutComponent, LayoutItemComponent, MatIconModule, RouterLink],
})
export class RoomComponent implements OnInit {
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
