import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomComponent } from './room.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RoomRoutingModule } from './room-routing.module';
import { JoinRoomComponent } from './join-room/join-room.component';
import { RoomDetailsComponent } from 'src/app/shared/components/room-details/room-details.component';
import { AdminRoomComponent } from './admin-room/admin-room.component';
import { ClosedRoomComponent } from './closed-room/closed-room.component';
import { RoomService } from './room.service';
import { SummaryBoardComponent } from 'src/app/shared/components/summary-board/summary-board.component';
import { MarkdownModule } from 'ngx-markdown';

@NgModule({
  imports: [
    CommonModule,
    SharedModule.forRoot(),
    RoomRoutingModule,
    RoomDetailsComponent,
    SummaryBoardComponent,
    MarkdownModule.forRoot(),
  ],
  declarations: [RoomComponent, JoinRoomComponent, AdminRoomComponent, ClosedRoomComponent],
  providers: [RoomService],
})
export class RoomModule {}
