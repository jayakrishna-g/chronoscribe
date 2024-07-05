import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
  standalone: true,
  imports: [MatIconModule],
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
