/*!
 * NDVI Panel Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ndvi-panel',
  templateUrl: './ndvi-panel.component.html',
  styleUrls: ['./ndvi-panel.component.sass']
})
export class NdviPanelComponent implements OnInit {
  @Output() panelIconClick: EventEmitter<Event> = new EventEmitter();
  @ViewChild('controlwrapper') controlWrapper: ElementRef;

  constructor() { }

  ngOnInit() { }

  onPanelIconClick(event) {
    this.panelIconClick.emit(event);
  }

}


