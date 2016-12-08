/* tslint:disable:no-unused-variable */

/*!
 * Custom Validators Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { TestBed, async, inject } from '@angular/core/testing';
import { CustomValidators } from './custom-validators';

describe('Custom Validator: Date ISO', () => {
  let control: FormControl;
  let validator: ValidatorFn;

  beforeEach(() => {
    validator = CustomValidators.dateISO;
  });

  it('"" should equal to "null"', () => {
    control = new FormControl('');

    expect(validator(control)).toBeNull();
  });

  it('should return null when date is 2016-09-12', () => {
    control = new FormControl('2016-09-12');

    expect(validator(control)).toBeNull();
  });

  it('should return null when date is 2016-10-12', () => {
    control = new FormControl('2016-10-12');

    expect(validator(control)).toBeNull();
  });

  it('should return an object when date is invalid (2016-9-12)', () => {
    control = new FormControl('2016-9-12');

    expect(validator(control)).toEqual({
      'dateISO': true
    });
  });

  it('should return an object when date is invalid (2016-13-12)', () => {
    control = new FormControl('2016-13-12');

    expect(validator(control)).toEqual({
      'dateISO': true
    });
  });

});

describe('Custom Validator: Number', () => {
  let control: FormControl;
  let validator: ValidatorFn;

  beforeEach(() => {
    validator = CustomValidators.number;
  });

  it('"" should equal to "null"', () => {
    control = new FormControl('');

    expect(validator(control)).toBeNull();
  });

  it('should return null when value is a number', () => {
    control = new FormControl('10');

    expect(validator(control)).toBeNull();
  });

  it('should return null when value is a number with a decimal', () => {
    control = new FormControl('10.1');

    expect(validator(control)).toBeNull();
  });

  it('should return an object when value has any other character than a number', () => {
    control = new FormControl('10.1v');

    expect(validator(control)).toEqual({
      'number': true
    });
  });

});


