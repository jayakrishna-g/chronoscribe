import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Form, UntypedFormControl, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { TranscriptInstance } from 'src/app/shared/services/recording.service';
import { MatLegacyInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyCardModule } from '@angular/material/legacy-card';
import { NgTemplateOutlet } from '@angular/common';

export interface Room {
  room_id?: string;
  name: string;
  description: string;
  owner: string;
  transcript?: TranscriptInstance[];
  summaries?: string[];
}

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: true,
    imports: [
        NgTemplateOutlet,
        MatLegacyCardModule,
        FormsModule,
        ReactiveFormsModule,
        MatLegacyFormFieldModule,
        MatLegacyInputModule,
    ],
})
export class HomeComponent implements OnInit {
  createRoomForm!: UntypedFormGroup;
  joinRoomForm!: UntypedFormGroup;
  user = this.authService.getTokenData().email;

  constructor(private http: HttpClient, private router: Router, private authService: AuthenticationService) {}

  ngOnInit(): void {
    this.createRoomForm = new UntypedFormGroup({
      name: new UntypedFormControl('', Validators.required),
      description: new UntypedFormControl('', Validators.required),
    });
    this.joinRoomForm = new UntypedFormGroup({
      roomId: new UntypedFormControl('', Validators.required),
    });
  }

  createRoom() {
    if (this.createRoomForm.valid) {
      const room: Room = {
        name: this.createRoomForm.controls['name'].value,
        description: this.createRoomForm.controls['description'].value,
        owner: this.authService.getTokenData().email,
      };
      console.log(room);
      this.http.post<Room>('/api/room', room).subscribe((res) => {
        this.router.navigate(['room', res.room_id]);
      });
    }
  }

  joinRoom() {
    if (this.joinRoomForm.valid) {
      this.router.navigate(['room', 'join', this.joinRoomForm.controls['roomId'].value]);
    }
  }
}
