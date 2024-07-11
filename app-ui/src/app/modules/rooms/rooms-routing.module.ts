import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomComponent } from '../room/room.component';
import { RoomsComponent } from './rooms.component';
import { RoomsResolver } from '../resolvers/rooms.resolver';

const routes: Routes = [
  {
    path: '',
    component: RoomsComponent,
    resolve: {
      rooms: RoomsResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoomsRoutingModule {}
