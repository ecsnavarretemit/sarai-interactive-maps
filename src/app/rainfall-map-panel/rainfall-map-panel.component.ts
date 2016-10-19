/*!
 * Rainfall Map Panel Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-rainfall-map-panel',
  templateUrl: './rainfall-map-panel.component.html',
  styleUrls: ['./rainfall-map-panel.component.sass']
})
export class RainfallMapPanelComponent implements OnInit {
  @Output() panelIconClick: EventEmitter<Event> = new EventEmitter();
  @ViewChild('controlwrapper') controlWrapper: ElementRef;

  constructor() { }

  ngOnInit() {}

  onPanelIconClick(event) {
    this.panelIconClick.emit(event);
  }

}


