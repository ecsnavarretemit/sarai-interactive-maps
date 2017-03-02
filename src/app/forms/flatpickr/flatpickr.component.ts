/*!
 * FlatPickr Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import assign from 'lodash-es/assign';
import * as Flatpickr from 'flatpickr';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'app-forms-flatpickr',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FlatpickrComponent),
      multi: true
    }
  ],
  templateUrl: './flatpickr.component.html',
  styleUrls: ['./flatpickr.component.sass']
})
export class FlatpickrComponent implements AfterViewInit, ControlValueAccessor, OnDestroy, OnInit {
  @Input('options') options: Flatpickr.Options = {};
  @Input('placeholder') placeholder: string = 'Select Date';
  @Output('change') change: EventEmitter<string> = new EventEmitter<string>();
  @Output('close') close: EventEmitter<string> = new EventEmitter<string>();
  @Output('open') open: EventEmitter<string> = new EventEmitter<string>();
  @Output('ready') ready: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('inputControl') inputControl: ElementRef;

  public dateValue: string;
  private _pluginInstance: Flatpickr;
  private _propagateChange = (_: any) => {};
  private _propagateTouch = () => {};

  constructor(private _renderer: Renderer) { }

  // throw a warning to the component user if he tries to access this property directly.
  get pluginInstance(): Flatpickr {
    console.warn('Accessing this property may bear unexpected results. Please use the shimmed methods for the correct behavior.');

    return this._pluginInstance;
  }

  showPicker() {
    this._pluginInstance.open();
  }

  hidePicker() {
    this._pluginInstance.close();
  }

  jumpToDate(date: string | Date) {
    this._pluginInstance.jumpToDate(date);
  }

  setOption(option, value) {
    const newOptionObj = {};

    // set the new option using the array notation
    newOptionObj[option] = value;

    // merge the new option to the options property
    this.options = assign({}, this.options, newOptionObj);

    // reflect the new plugin option
    this._pluginInstance.set(option, value);
  }

  writeValue(value: any) {
    if (typeof value !== 'undefined') {
      this.dateValue = value;
    }

    if (typeof value !== 'undefined' && typeof this._pluginInstance !== 'undefined') {
      this._pluginInstance.setDate(value);
    }
  }

  registerOnChange(fn: any) {
    this._propagateChange = fn;
  }

  registerOnTouched(fn: any) {
    this._propagateTouch = fn;
  }

  ngOnInit() {
    // override onReady option since this is an angular implementation.
    this.options.onReady = () => {
      this.ready.emit('ready');
    };

    // override onChange option since this is an angular implementation.
    this.options.onChange = (selectedDates: Array<Date>, dateStr: string) => {
      this.change.emit(dateStr);

      this._propagateChange(dateStr);
    };

    // override onClose option since this is an angular implementation.
    this.options.onClose = (selectedDates: Array<Date>, dateStr: string) => {
      this.close.emit(dateStr);

      this._propagateTouch();
    };

    // override onOpen option since this is an angular implementation.
    this.options.onOpen = (selectedDates: Array<Date>, dateStr: string) => {
      this.open.emit(dateStr);
    };
  }

  ngAfterViewInit() {
    // instantiate the plugin
    this._pluginInstance = new Flatpickr(this.inputControl.nativeElement, this.options);

    // stop propagating the change upwards to prevent change event of this component
    // from being incorrectly fired due to the same event name
    this._renderer.listen(this.inputControl.nativeElement, 'change', (evt: Event) => {
      evt.stopPropagation();
    });
  }

  ngOnDestroy() {
    // destroy the instance of the plugin
    this._pluginInstance.destroy();
  }

}


