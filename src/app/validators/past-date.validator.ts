import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export function pastDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const date = control.value;
    if (!date) {
      return null;
    }
    const currentDate = new Date();
    const selectedDate = new Date(date);
    return selectedDate <= currentDate ? null : { futureDate: true };
  };
}
