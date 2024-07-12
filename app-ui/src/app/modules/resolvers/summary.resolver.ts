import { Injectable } from '@angular/core';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { RoomService, SummaryInstance } from '../room/room.service';

@Injectable({
  providedIn: 'root',
})
export class SummaryResolver {
  constructor(private roomService: RoomService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SummaryInstance[]> {
    return this.roomService.getSummary(route.params.id);
  }
}
