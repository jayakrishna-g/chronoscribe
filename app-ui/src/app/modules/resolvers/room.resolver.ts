import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { RoomService } from '../room/room.service';
import { Room } from '../home/home.component';

@Injectable({
  providedIn: 'root',
})
export class RoomResolver implements Resolve<Room> {
  constructor(private roomService: RoomService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Room> {
    return this.roomService.getRoom(route.params.id);
  }
}
