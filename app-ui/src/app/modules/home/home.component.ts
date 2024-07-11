import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  Form,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { TranscriptInstance } from 'src/app/shared/services/recording.service';
import { AsyncPipe, NgForOf, NgIf, NgTemplateOutlet } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { BehaviorSubject } from 'rxjs';
import { MatIcon } from '@angular/material/icon';

export interface RoomMetaData {
  room_id?: string;
  name: string;
  description: string;
  owner_id: string;
}

export interface Room {
  id: string;
  transcript_file: string;
  summary_file: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    NgTemplateOutlet,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgForOf,
    AsyncPipe,
    MatIcon,
    NgIf,
  ],
})
export class HomeComponent implements OnInit {
  createRoomForm!: UntypedFormGroup;
  joinRoomForm!: UntypedFormGroup;
  user = this.authService.getTokenData().email;
  recentRooms = new BehaviorSubject<RoomMetaData[]>([]);

  constructor(private http: HttpClient, private router: Router, private authService: AuthenticationService) {}

  ngOnInit(): void {
    this.createRoomForm = new UntypedFormGroup({
      name: new UntypedFormControl('', Validators.required),
      description: new UntypedFormControl('', Validators.required),
    });
    this.joinRoomForm = new UntypedFormGroup({
      roomId: new UntypedFormControl('', Validators.required),
    });
    this.http.get<RoomMetaData[]>('/api/room/recent').subscribe((res) => {
      if (res) this.recentRooms.next(res);
    });
  }

  createRoom() {
    if (this.createRoomForm.valid) {
      const room: RoomMetaData = {
        name: this.createRoomForm.controls['name'].value,
        description: this.createRoomForm.controls['description'].value,
        owner_id: this.authService.getTokenData().email,
      };
      console.log(room);
      this.http.post<RoomMetaData>('/api/room', room).subscribe((res) => {
        this.router.navigate(['room', res.room_id]);
      });
    }
  }

  joinRoom() {
    if (this.joinRoomForm.valid) {
      this.router.navigate(['room', this.joinRoomForm.controls['roomId'].value]);
    }
  }
  navigateToRoom(roomId: string | undefined) {
    if (roomId) {
      this.router.navigate(['room', roomId]);
    }
  }
}
