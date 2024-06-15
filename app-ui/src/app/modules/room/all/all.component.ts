import { Component, OnInit } from '@angular/core';
import { Room } from '../../home/home.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { LayoutItemComponent } from '../../../shared/components/layout-item/layout-item.component';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';

@Component({
    selector: 'app-all',
    templateUrl: './all.component.html',
    styleUrls: ['./all.component.scss'],
    standalone: true,
    imports: [
        LayoutComponent,
        LayoutItemComponent,
        MatIconModule,
        RouterLink,
    ],
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
