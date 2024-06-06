import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from '../../authentication/authentication.service';
import { DisplayDetailsComponent } from 'src/app/shared/components/display-details/display-details.component';

@Component({
  selector: 'app-title-bar',
  templateUrl: './title-bar.component.html',
  styleUrls: ['./title-bar.component.scss'],
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
