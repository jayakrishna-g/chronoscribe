import { Component, Input, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { AuthenticationService } from '../../authentication/authentication.service';
import { DisplayDetailsComponent } from 'src/app/shared/components/display-details/display-details.component';
import { FlexModule } from '@angular/flex-layout/flex';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-title-bar',
  templateUrl: './title-bar.component.html',
  styleUrls: ['./title-bar.component.scss'],
  standalone: true,
  imports: [MatIconModule, FlexModule],
})
export class TitleBarComponent implements OnInit {
  @Input()
  device!: string;

  constructor(private dialog: MatDialog, private authservice: AuthenticationService) {}

  ngOnInit(): void {}
  displayDetails() {
    const DialogData = this.authservice.getTokenData();
    this.dialog.open(DisplayDetailsComponent, {
      data: {
        name: DialogData.full_name,
        email: DialogData.email,
      },
    });
  }
}
