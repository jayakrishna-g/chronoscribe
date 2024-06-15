import { Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
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
