/*!
 * Leaflet Button Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, Input, Output, ViewChild, EventEmitter, ElementRef } from '@angular/core';

@Component({
  selector: 'app-leaflet-button',
  templateUrl: './leaflet-button.component.html',
  styleUrls: ['./leaflet-button.component.sass'],
})
export class LeafletButtonComponent implements OnInit {
  private tooltipEnabled = false;

  @Input('control-class') controlClass: string;
  @Input('btn-tooltip') btnTooltip: string = 'Default Text';
  @Input('btn-tooltip-position') btnTooltipPosition: string = 'left';
  @Output() buttonClick: EventEmitter<Event> = new EventEmitter();
  @ViewChild('controlwrapper') controlWrapper: ElementRef;
  @ViewChild('button') button: ElementRef;

  constructor() { }

  ngOnInit() {
    if (typeof this.controlClass !== 'undefined' && this.controlClass !== '') {
      let split = this.controlClass.split(' ');

      // add the class to the content
      this.controlWrapper.nativeElement.classList.add(...split);
    }

    if (this.btnTooltip !== 'Default Text' && this.btnTooltip !== '') {
      this.tooltipEnabled = true;
    }
  }

  onClick(event) {
    this.buttonClick.emit(event);
  }

}


