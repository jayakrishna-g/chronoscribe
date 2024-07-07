import { Injectable } from '@angular/core';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { RoomService } from '../room/room.service';
import { RoomMetaData } from '../home/home.component';

@Injectable({
  providedIn: 'root',
})
export class RoomMetaResolver {
  constructor(private roomService: RoomService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RoomMetaData> {
    return this.roomService.getRoomMetaData(route.params.id);
  }
}
