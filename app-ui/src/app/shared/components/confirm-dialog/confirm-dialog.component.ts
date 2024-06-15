import { Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss'],
    standalone: true,
    imports: [MatIconModule, MatLegacyButtonModule],
})
export class ConfirmDialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>) {}
  deleteStatus: boolean = false;
  ngOnInit(): void {}
  delete() {
    this.deleteStatus = true;
    this.closeDialog();
  }
  closeDialog() {
    this.dialogRef.close(this.deleteStatus);
  }
}
