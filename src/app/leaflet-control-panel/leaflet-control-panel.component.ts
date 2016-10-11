/*!
 * Leaflet Control Panel
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-leaflet-control-panel',
  templateUrl: './leaflet-control-panel.component.html',
  styleUrls: ['./leaflet-control-panel.component.sass']
})
export class LeafletControlPanelComponent implements OnInit {
  @ViewChild('controlwrapper') controlWrapper: ElementRef;

  constructor() { }

  ngOnInit() {
  }

}


