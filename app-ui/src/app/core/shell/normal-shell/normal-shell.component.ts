import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavListComponent } from '../nav-list/nav-list.component';
import { TitleBarComponent } from '../title-bar/title-bar.component';

@Component({
  selector: 'app-normal-shell',
  templateUrl: './normal-shell.component.html',
  styleUrls: ['./normal-shell.component.scss'],
  standalone: true,
  imports: [TitleBarComponent, NavListComponent, RouterOutlet],
})
export class NormalShellComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
