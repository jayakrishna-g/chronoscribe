import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-display-details',
  templateUrl: './display-details.component.html',
  styleUrls: ['./display-details.component.scss'],
})
export class DisplayDetailsComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<DisplayDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {}
}
