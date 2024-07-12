import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoomsRoutingModule } from './rooms-routing.module';
import { RoomsComponent } from './rooms.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [RoomsComponent],
  imports: [CommonModule, RoomsRoutingModule, SharedModule.forRoot(), MatIconModule],
})
export class RoomsModule {}
