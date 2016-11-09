/*!
 * Leaflet Zoom Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, ViewChild, ElementRef, Renderer } from '@angular/core';
import { LeafletMapService } from '../leaflet-map.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-leaflet-zoom',
  templateUrl: './leaflet-zoom.component.html',
  styleUrls: ['./leaflet-zoom.component.sass']
})
export class LeafletZoomComponent implements OnInit {
  public control: L.Control;

  @ViewChild('controlwrapper') controlWrapper: ElementRef;

  constructor(
    private _mapService: LeafletMapService,
    private _renderer: Renderer
  ) { }

  ngOnInit() {
    this.control = new (L as any).Control.Zoom();

    this._mapService
      .getMap()
      .then((map: L.Map) => {
        // add to the map
        this.control.addTo(map);

        // remove the default container
        this.control.getContainer().remove();

        let container = this.control.onAdd(map);

        // append the element container to the controlWrapper
        this._renderer.invokeElementMethod(this.controlWrapper.nativeElement, 'appendChild', [
          container
        ]);
      })
      ;
  }

}


