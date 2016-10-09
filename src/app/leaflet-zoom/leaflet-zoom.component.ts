/*!
 * Leaflet Zoom Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Map, Control } from 'leaflet';

@Component({
  selector: 'app-leaflet-zoom',
  templateUrl: './leaflet-zoom.component.html',
  styleUrls: ['./leaflet-zoom.component.sass']
})
export class LeafletZoomComponent implements OnInit {
  public control: Control;

  @Input() map: Map;
  @ViewChild('controlwrapper') controlWrapper;

  constructor() { }

  ngOnInit() {
    this.control = new (L as any).Control.Zoom();

    // add to the map
    this.control.addTo(this.map);

    // remove the default container
    this.control.getContainer().remove();

    // add to the wrapper
    this.controlWrapper.nativeElement.appendChild(this.control.onAdd(this.map));
  }

}


