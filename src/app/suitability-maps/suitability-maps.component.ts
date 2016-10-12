/*!
 * Suitability Maps Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { LeafletWmsLayerComponent } from '../leaflet-wms-layer/leaflet-wms-layer.component';
import { WmsLayerService } from '../wms-layer.service';
import { WMSOptions } from 'leaflet';

@Component({
  selector: 'app-suitability-maps',
  templateUrl: './suitability-maps.component.html',
  styleUrls: ['./suitability-maps.component.sass']
})
export class SuitabilityMapsComponent implements OnInit {
  public WMSTileUrl = this._wmsLayerService.getUrl();
  public layersOptionsCollection: Array<WMSOptions> = [];

  @ViewChildren(LeafletWmsLayerComponent) layers: QueryList<LeafletWmsLayerComponent>;

  constructor(private _wmsLayerService: WmsLayerService) {
    this.layersOptionsCollection = this._wmsLayerService.getSuitabilityMapCountryLevelLayers('rice');
  }

  ngOnInit() { }

}


