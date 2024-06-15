import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Room } from '../home/home.component';
import { RoomService } from '../room/room.service';

@Injectable({
  providedIn: 'root',
})
export class RoomsResolver {
  constructor(private roomService: RoomService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Room[]> {
    return this.roomService.getRooms();
  }
}
