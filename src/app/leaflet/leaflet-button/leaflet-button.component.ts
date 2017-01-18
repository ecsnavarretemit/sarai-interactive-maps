/*!
 * Leaflet Button Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, Input, Output, ViewChild, EventEmitter, ElementRef, Renderer } from '@angular/core';
import each from 'lodash-es/each';

@Component({
  selector: 'app-leaflet-button',
  templateUrl: './leaflet-button.component.html',
  styleUrls: ['./leaflet-button.component.sass'],
})
export class LeafletButtonComponent implements OnInit {
  public tooltipEnabled = true;
  public active = false;

  @Input() controlClass: string;
  @Input() btnTooltip: string = 'Default Text';
  @Input() btnTooltipPosition: string = 'left';
  @Output() buttonClick: EventEmitter<Event> = new EventEmitter<Event>();
  @ViewChild('controlwrapper') controlWrapper: ElementRef;
  @ViewChild('button') button: ElementRef;

  constructor(private _renderer: Renderer) { }

  ngOnInit() {
    if (typeof this.controlClass !== 'undefined' && this.controlClass !== '') {
      const split = this.controlClass.split(' ');

      // add the class to the content
      each(split, (className: string) => {
        this._renderer.setElementClass(this.controlWrapper.nativeElement, className, true);
      });
    }

    if (this.btnTooltip !== 'Default Text' && this.btnTooltip !== '') {
      this.tooltipEnabled = false;
    }
  }

  toggleActiveState() {
    // invert the value
    this.active = !this.active;

    this._renderer.setElementClass(this.button.nativeElement, 'btn--inverted', this.active);
  }

  onClick(event) {
    // emit the button click event
    this.buttonClick.emit(event);
  }

}


