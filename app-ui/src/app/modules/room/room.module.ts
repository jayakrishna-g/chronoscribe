import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomComponent } from './room.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RoomRoutingModule } from './room-routing.module';
import { JoinRoomComponent } from './join-room/join-room.component';
import { AllComponent } from './all/all.component';

@NgModule({
    imports: [CommonModule, SharedModule.forRoot(), RoomRoutingModule, RoomComponent, JoinRoomComponent, AllComponent],
})
export class RoomModule {}
