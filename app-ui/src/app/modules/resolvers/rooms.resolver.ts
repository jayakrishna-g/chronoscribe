import { Injectable } from '@angular/core';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { RoomService } from '../room/room.service';
import { Room } from '../home/home.component';

export interface RoomActivity {
  room_id: string;
  user_id: string;
  activity: string;
  owner: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class RoomsResolver {
  constructor(private roomService: RoomService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RoomActivity[]> {
    return this.roomService.getRoomActivityData();
  }
}
