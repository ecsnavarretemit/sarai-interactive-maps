/*!
 * Leaflet Button Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-leaflet-button',
  templateUrl: './leaflet-button.component.html',
  styleUrls: ['./leaflet-button.component.sass'],
})
export class LeafletButtonComponent implements OnInit {
  @Input('control-class') controlClass: string;
  @Output() buttonClick: EventEmitter<Event> = new EventEmitter();
  @ViewChild('controlwrapper') controlWrapper;

  constructor() { }

  ngOnInit() {
    if (typeof this.controlClass !== 'undefined' && this.controlClass !== '') {
      let split = this.controlClass.split(' ');

      // add the class to the content
      this.controlWrapper.nativeElement.classList.add(...split);
    }
  }

  onClick(event) {
    this.buttonClick.emit(event);
  }

}


