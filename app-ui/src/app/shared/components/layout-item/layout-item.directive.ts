import { Directive } from '@angular/core';

@Directive({
    selector: '[appLayoutItem]',
    standalone: true,
})
export class LayoutItemDirective {
  constructor() {}
}
