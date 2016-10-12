/*!
 * App Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, ViewChildren, QueryList } from '@angular/core';
import { LeafletWmsLayerComponent } from './leaflet-wms-layer/leaflet-wms-layer.component';
import { WmsLayerService } from './wms-layer.service';
import { WMSOptions } from 'leaflet';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  public WMSTileUrl = this._wmsLayerService.getUrl();
  public layersOptionsCollection: Array<WMSOptions> = [];
  public layersOpacity = 0.6;

  @ViewChildren(LeafletWmsLayerComponent) layers: QueryList<LeafletWmsLayerComponent>;

  constructor(private _wmsLayerService: WmsLayerService) {
    this.layersOptionsCollection = this._wmsLayerService.getSuitabilityMapCountryLevelLayers('rice');
  }

}


