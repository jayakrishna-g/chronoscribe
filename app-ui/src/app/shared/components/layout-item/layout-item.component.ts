import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Layout } from '../layout/layout.component';
import { NgIf, NgTemplateOutlet } from '@angular/common';

@Component({
    selector: 'app-layout-item',
    templateUrl: './layout-item.component.html',
    styleUrls: ['./layout-item.component.scss'],
    standalone: true,
    imports: [NgIf, NgTemplateOutlet],
})
export class LayoutItemComponent implements OnInit {
  @Input()
  layout: Layout = 'Card';
  constructor() {}

  ngOnInit(): void {}
}
