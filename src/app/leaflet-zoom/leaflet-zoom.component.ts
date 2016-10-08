/*!
 * Leaflet Zoom Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, Input, ViewChild } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-leaflet-zoom',
  templateUrl: './leaflet-zoom.component.html',
  styleUrls: ['./leaflet-zoom.component.sass']
})
export class LeafletZoomComponent implements OnInit {
  public control: any;

  @Input() map: any;
  @ViewChild('controlwrapper') controlWrapper;

  constructor() { }

  ngOnInit() {
    // prevent 'Control' is not a propery of L
    let controlObj = (L as any).Control;

    this.control = new controlObj.Zoom();

    // add to the map
    this.control.addTo(this.map);

    // remove the default container
    this.control._container.remove();

    // add to the wrapper
    this.controlWrapper.nativeElement.appendChild(this.control.onAdd(this.map));
  }

}


