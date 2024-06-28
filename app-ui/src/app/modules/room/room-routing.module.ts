import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { RoomComponent } from './room.component';
import { RoomResolver } from '../resolvers/room.resolver';
import { JoinRoomComponent } from './join-room/join-room.component';
import { RoomsResolver } from '../resolvers/rooms.resolver';
import { AdminRoomComponent } from './admin-room/admin-room.component';

const routes: Routes = [
  {
    path: ':id',
    component: AdminRoomComponent,
    resolve: { room: RoomResolver },
  },
  {
    path: 'join/:id',
    component: JoinRoomComponent,
    resolve: { room: RoomResolver },
  },
  {
    path: '',
    component: RoomComponent,
    resolve: { rooms: RoomsResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoomRoutingModule {}
