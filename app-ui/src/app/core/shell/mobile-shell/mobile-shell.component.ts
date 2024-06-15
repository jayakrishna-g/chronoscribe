import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavListComponent } from '../nav-list/nav-list.component';
import { TitleBarComponent } from '../title-bar/title-bar.component';

@Component({
    selector: 'app-mobile-shell',
    templateUrl: './mobile-shell.component.html',
    styleUrls: ['./mobile-shell.component.scss'],
    standalone: true,
    imports: [
        TitleBarComponent,
        NavListComponent,
        RouterOutlet,
    ],
})
export class MobileShellComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
