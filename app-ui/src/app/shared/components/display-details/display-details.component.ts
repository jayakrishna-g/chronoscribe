import { Component, Inject, OnInit } from '@angular/core';

import { NgTemplateOutlet } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-display-details',
  templateUrl: './display-details.component.html',
  styleUrls: ['./display-details.component.scss'],
  standalone: true,
  imports: [NgTemplateOutlet],
})
export class DisplayDetailsComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<DisplayDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {}
}
