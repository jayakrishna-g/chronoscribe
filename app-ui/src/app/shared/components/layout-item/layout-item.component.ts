import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Layout } from '../layout/layout.component';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-layout-item',
  templateUrl: './layout-item.component.html',
  styleUrls: ['./layout-item.component.scss'],
  standalone: true,
  imports: [NgTemplateOutlet],
})
export class LayoutItemComponent implements OnInit {
  @Input()
  layout: Layout = 'Card';
  constructor() {}

  ngOnInit(): void {}
}
