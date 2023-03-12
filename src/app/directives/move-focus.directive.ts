import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appMoveFocus]',
})
export class MoveFocusDirective {
  constructor(private el: ElementRef) {}

  @HostListener('keydown.arrowdown', ['$event'])
  @HostListener('keydown.arrowup', ['$event'])
  @HostListener('keydown.arrowleft', ['$event'])
  @HostListener('keydown.arrowright', ['$event'])
  onKeydown(event: KeyboardEvent) {
    const inputs: HTMLInputElement[] = Array.from(
      this.el.nativeElement.querySelectorAll('input')
    );
    const index = inputs.findIndex((input) => input === event.target);
    if (index === -1) {
      return;
    }
    switch (event.key) {
      case 'ArrowDown':
        const nextRowIndex = index + 8 < inputs.length ? index + 8 : index % 8;
        inputs[nextRowIndex].focus();

        break;
      case 'ArrowUp':
        const previousRowIndex = index - 8 >= 0 ? index - 8 : index % 8;
        inputs[previousRowIndex].focus();

        break;
      case 'ArrowRight':
        const nextColumnIndex = index + 1 < inputs.length ? index + 1 : 0;
        inputs[nextColumnIndex].focus();

        break;
      case 'ArrowLeft':
        const previousColumnIndex =
          index - 1 >= 0 ? index - 1 : inputs.length - 1;
        inputs[previousColumnIndex].focus();

        break;
      default:
        event.preventDefault();
        break;
    }
  }
}
