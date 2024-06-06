/* eslint-disable @angular-eslint/directive-selector */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({ selector: '[runScripts]' })
export class RunScriptsDirective implements OnInit {
  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    setTimeout(() => {
      // wait for DOM rendering
      this.reinsertScripts();
    });
  }

  reinsertScripts(): void {
    const scripts = <HTMLScriptElement[]>this.elementRef.nativeElement.getElementsByTagName('script');
    console.log(scripts);
    const scriptsInitialLength = scripts.length;
    for (let i = 0; i < scriptsInitialLength; i++) {
      const script = scripts[i];
      const scriptCopy = <HTMLScriptElement>document.createElement('script');
      scriptCopy.type = script.type ? script.type : 'text/javascript';
      if (script.innerHTML) {
        scriptCopy.innerHTML = script.innerHTML;
      } else if (script.src) {
        scriptCopy.src = script.src;
      }
      scriptCopy.async = false;
      console.log(scriptCopy);
      script?.parentNode?.replaceChild(scriptCopy, script);
    }
  }
}
