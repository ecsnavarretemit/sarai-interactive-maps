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
import 'jquery';

@Component({
  selector: 'app-leaflet-tile-selector',
  templateUrl: './leaflet-tile-selector.component.html',
  styleUrls: ['./leaflet-tile-selector.component.sass']
})
export class LeafletTileSelectorComponent implements OnInit, AfterViewInit {
  public tileKeys: any;
  public tileProviderKey: string;
  private $mapControl: JQuery;
  private $mapControlSettings: JQuery;

  @Input() map: Map;
  @ViewChild('controlwrapper') controlWrapper;
  @ViewChild('controlsettings') controlSettings;
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

    // cache the selection
    this.$mapControl = $( this.controlWrapper.nativeElement );
    this.$mapControlSettings = $( this.controlSettings.controlWrapper.nativeElement );
  }

  onHideControl(event): Promise<any> {
    return new Promise((resolve, reject) => {
      if (typeof this.$mapControl === 'undefined') {
        reject();
      } else {
        // show the button
        this.$mapControlSettings.fadeIn();

        // hide the map control
        this.$mapControl
          .fadeOut()
          .promise()
          .then(() => {
            // remove class on the control wrapper
            this.$mapControl
              .closest('.control-wrapper')
              .addClass('control-wrapper--tile-selector-hidden')
              ;

            resolve();
          }, () => {
            reject();
          })
          ;
      }
    });
  }

  onShowControl(event): Promise<any> {
    return new Promise((resolve, reject) => {
      if (typeof this.$mapControl === 'undefined') {
        reject();
      } else {
        // add class the to the control wrapper
        this.$mapControl
          .closest('.control-wrapper')
          .removeClass('control-wrapper--tile-selector-hidden')
          ;

        // hide the button
        this.$mapControlSettings.fadeOut();

        // show the map control
        this.$mapControl
          .fadeIn()
          .promise()
          .then(() => {
            resolve();
          }, () => {
            reject();
          })
          ;
      }
    });
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


