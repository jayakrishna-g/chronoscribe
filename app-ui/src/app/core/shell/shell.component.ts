import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit {
  smallScreen = new BehaviorSubject<boolean>(false);
  constructor(public breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    this.breakpointObserver.observe(['(min-width: 768px)']).subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.smallScreen.next(false);
        localStorage.setItem('smalScreen', 'false');
      } else {
        this.smallScreen.next(true);
        localStorage.setItem('smallScreen', 'true');
      }
    });
  }
}
