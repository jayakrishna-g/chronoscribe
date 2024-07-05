import { Component, Inject, Input, OnInit } from '@angular/core';
import { AuthenticationService } from '../../authentication/authentication.service';
import { DisplayDetailsComponent } from 'src/app/shared/components/display-details/display-details.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-title-bar',
  templateUrl: './title-bar.component.html',
  styleUrls: ['./title-bar.component.scss'],
  standalone: true,
  imports: [MatIconModule],
})
export class TitleBarComponent implements OnInit {
  @Input()
  device!: string;

  constructor(private authservice: AuthenticationService) {}

  ngOnInit(): void {}
}
