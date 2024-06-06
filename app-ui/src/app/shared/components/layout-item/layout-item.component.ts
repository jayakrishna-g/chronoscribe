import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Layout } from '../layout/layout.component';

@Component({
  selector: 'app-layout-item',
  templateUrl: './layout-item.component.html',
  styleUrls: ['./layout-item.component.scss'],
})
export class LayoutItemComponent implements OnInit {
  @Input()
  layout: Layout = 'Card';
  constructor() {}

  ngOnInit(): void {}
}
