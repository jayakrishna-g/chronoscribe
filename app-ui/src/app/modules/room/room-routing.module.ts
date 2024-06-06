import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { RoomComponent } from './room.component';
import { RoomResolver } from '../resolvers/room.resolver';
import { JoinRoomComponent } from './join-room/join-room.component';
import { AllComponent } from './all/all.component';
import { RoomsResolver } from '../resolvers/rooms.resolver';

const routes: Routes = [
  {
    path: ':id',
    component: RoomComponent,
    resolve: { room: RoomResolver },
  },
  {
    path: 'join/:id',
    component: JoinRoomComponent,
    resolve: { room: RoomResolver },
  },
  {
    path: '',
    component: AllComponent,
    resolve: { rooms: RoomsResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoomRoutingModule {}
