import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LiveTranscriptionRoutingModule } from './live-transcription-routing.module';
import { LandingComponent } from './landing/landing.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [LandingComponent],
  imports: [CommonModule, LiveTranscriptionRoutingModule, SharedModule.forRoot()],
})
export class LiveTranscriptionModule {}
