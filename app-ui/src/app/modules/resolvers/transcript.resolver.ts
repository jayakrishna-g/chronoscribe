import { Injectable } from '@angular/core';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { RoomService } from '../room/room.service';
import { Room } from '../home/home.component';
import { TranscriptInstance } from 'src/app/shared/services/recording.service';

@Injectable({
  providedIn: 'root',
})
export class TranscriptResolver {
  constructor(private roomService: RoomService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TranscriptInstance[]> {
    return this.roomService.getTranscript(route.params.id);
  }
}
