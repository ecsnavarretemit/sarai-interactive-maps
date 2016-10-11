/*!
 * Leaflet WMS Layer Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, AfterViewInit } from '@angular/core';
import { LeafletMapService } from '../leaflet-map.service';
import { Map, WMS } from 'leaflet';

@Component({
  selector: 'app-leaflet-wms-layer',
  templateUrl: './leaflet-wms-layer.component.html',
  styleUrls: ['./leaflet-wms-layer.component.sass']
})
export class LeafletWmsLayerComponent implements OnInit, AfterViewInit {
  public layer: WMS;

  constructor(private _mapService: LeafletMapService) { }

  ngOnInit() {
    let workspace = 'sarai-latest';
    let url = `http://202.92.144.40:8080/geoserver/${workspace}/wms?tiled=true`;

    let leafletApi = (L as any);

    // create the WMS tile layer
    this.layer = leafletApi.tileLayer.wms(url, {
      layers: workspace + ':rice_merged',
      format: 'image/png',
      transparent: true,
      maxZoom: 10,
      crs: leafletApi.CRS.EPSG900913,
      zIndex: 1000,
      attribution: `Crop data &copy; 2016
        <a href="http://www.pcaarrd.dost.gov.ph/" target="_blank">PCAARRD</a> and
        <a href="http://uplb.edu.ph/" target="_blank">University of the Philippines Los Banos</a>`
    });
  }

  ngAfterViewInit() {
    this._mapService
      .getMap()
      .then((map: Map) => {
        // add to the map when the view is finally initialized
        this.layer.addTo( map );
      })
      ;
  }

}


