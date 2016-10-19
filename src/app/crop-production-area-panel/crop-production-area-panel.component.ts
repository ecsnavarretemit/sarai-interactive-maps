/*!
 * Crop Production Area Panel Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-crop-production-area-panel',
  templateUrl: './crop-production-area-panel.component.html',
  styleUrls: ['./crop-production-area-panel.component.sass']
})
export class CropProductionAreaPanelComponent implements OnInit {
  @Output() panelIconClick: EventEmitter<Event> = new EventEmitter();
  @ViewChild('controlwrapper') controlWrapper: ElementRef;

  constructor() { }

  ngOnInit() {}

  onPanelIconClick(event) {
    this.panelIconClick.emit(event);
  }

}


