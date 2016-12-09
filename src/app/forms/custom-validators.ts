/*!
 * Custom Validators
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { AbstractControl, Validators } from '@angular/forms';

export class CustomValidators {

  /**
   * Validator that requires controls to have a value of dateISO.
   */
  static dateISO(control: AbstractControl): {[key: string]: boolean} {
    if (Validators.required(control) !== undefined && Validators.required(control) !== null) {
      return null;
    }

    let v: string = control.value;

    return /^\d{4}[\/\-](0[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(v) ? null : {
      'dateISO': true
    };
  }

  /**
   * Validator that requires controls to have a value of number.
   */
  static number(control: AbstractControl): {[key: string]: boolean} {
    if (Validators.required(control) !== undefined && Validators.required(control) !== null) {
      return null;
    }

    let v: string = control.value;
    return /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(v) ? null : {'number': true};
  }

}


