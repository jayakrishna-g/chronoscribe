import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomComponent } from './room.component';
import { RoomResolver } from '../resolvers/room.resolver';
import { RoomMetaResolver } from '../resolvers/roomMeta.resolver';
import { TranscriptResolver } from '../resolvers/transcript.resolver';
import { SummaryResolver } from '../resolvers/summary.resolver';

const routes: Routes = [
  {
    path: ':id',
    component: RoomComponent,
    resolve: {
      room: RoomResolver,
      roomMetaData: RoomMetaResolver,
      transcripts: TranscriptResolver,
      summaries: SummaryResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoomRoutingModule {}
