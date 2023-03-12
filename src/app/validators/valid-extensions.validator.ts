import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function validExtensionsValidator(extensions: string[]): ValidatorFn {
  return (control: AbstractControl<string>): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const extension = control.value.split('.').pop();
    return extension && extensions.includes(extension)
      ? null
      : { invalidExtension: true };
  };
}
