/*!
 * Leaflet Tile Selector Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, AfterViewInit, Input, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { LeafletTileProviderService } from '../leaflet-tile-provider.service';
import { Map } from 'leaflet';

@Component({
  selector: 'app-leaflet-tile-selector',
  templateUrl: './leaflet-tile-selector.component.html',
  styleUrls: ['./leaflet-tile-selector.component.sass']
})
export class LeafletTileSelectorComponent implements OnInit, AfterViewInit {
  public tileKeys: any;
  public tileProviderKey: string;

  @Input() map: Map;
  @ViewChild('tileselector') tileSelector;

  constructor(
    public store: Store<any>,
    private tileProvider: LeafletTileProviderService
  ) {
    this.tileProviderKey = 'Google Satellite';
  }

  ngOnInit() {
    // extract the keys and tore to the property
    this.tileKeys = Object.keys(this.tileProvider.baseMaps);

    // add default tile
    this.tileProvider.baseMaps[this.tileProviderKey].addTo(this.map);
  }

  ngAfterViewInit() {
    // set default select value
    this.tileSelector.nativeElement.value = this.tileProviderKey;
  }

  onTileChange(event) {
    let value = event.target.value;
    let resolvedTile = this.tileProvider.baseMaps[event.target.value];

    if (typeof resolvedTile !== 'undefined') {
      // remove the current layer
      this.map.removeLayer(this.tileProvider.baseMaps[this.tileProviderKey]);

      // add the new layer
      resolvedTile.addTo(this.map);

      // store the currently used tile
      this.tileProviderKey = value;

      // store the resolved tile provider to the state manager
      this.store.dispatch({
        type: 'SET_TILE_PROVIDER',
        payload: {
          tileProvider: value
        }
      });
    }
  }

}


