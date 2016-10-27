/*!
 * Leaflet Zoom Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Map, Control } from 'leaflet';
import { LeafletMapService } from '../leaflet-map.service';

@Component({
  selector: 'app-leaflet-zoom',
  templateUrl: './leaflet-zoom.component.html',
  styleUrls: ['./leaflet-zoom.component.sass']
})
export class LeafletZoomComponent implements OnInit {
  public control: Control;

  @ViewChild('controlwrapper') controlWrapper: ElementRef;

  constructor(private _mapService: LeafletMapService) { }

  ngOnInit() {
    this.control = new (L as any).Control.Zoom();

    this._mapService
      .getMap()
      .then((map: Map) => {
        // add to the map
        this.control.addTo(map);

        // remove the default container
        this.control.getContainer().remove();

        // add to the wrapper
        this.controlWrapper.nativeElement.appendChild(this.control.onAdd(map));
      })
      ;
  }

}


