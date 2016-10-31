/* tslint:disable:no-unused-variable */

/*!
 * Leaflet Tile Selector Component Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Renderer } from '@angular/core';
import { TestBed, async, inject } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { LeafletTileSelectorComponent } from './leaflet-tile-selector.component';
import { LeafletMapService } from '../leaflet-map.service';
import { LeafletTileProviderService } from '../leaflet-tile-provider.service';

describe('Component: LeafletTileSelector', () => {

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      Store,
      LeafletMapService,
      LeafletTileProviderService,
      Renderer,
      LeafletTileSelectorComponent
    ]
  }));

  it('should create an instance', inject([LeafletTileSelectorComponent], (component: LeafletTileSelectorComponent) => {
    expect(component).toBeTruthy();
  }));

});


