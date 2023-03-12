import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appInputArrowControl]',
})
export class InputArrowControlDirective {
  constructor() {}

  @HostListener('keydown.arrowdown', ['$event'])
  @HostListener('keydown.arrowup', ['$event'])
  onKeydown(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    if (input.type !== 'number') {
      return;
    }
    event.preventDefault();
  }
}
