import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appYoutubeVimeoUrl]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: YoutubeVimeoUrlValidatorDirective,
      multi: true,
    },
  ],
})
export class YoutubeVimeoUrlValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) return null;

    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+$/;
    const vimeoRegex = /^(https?:\/\/)?(www\.)?(vimeo\.com\/\d+|player\.vimeo\.com\/video\/\d+)$/;


    const isValid = youtubeRegex.test(value) || vimeoRegex.test(value);
    return isValid ? null : { invalidVideoUrl: true };
  }
}
