import { Component, OnInit } from '@angular/core';
import { RecordingService } from 'src/app/shared/services/recording.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
  isRecording = false;

  constructor(public recodingService: RecordingService) {}

  ngOnInit(): void {}

  startRecording(): void {
    this.isRecording = true;
    this.recodingService.startRecording();
  }

  stopRecording(): void {
    console.log('stop recording');
    this.isRecording = false;
    this.recodingService.stopRecording();
  }
}
