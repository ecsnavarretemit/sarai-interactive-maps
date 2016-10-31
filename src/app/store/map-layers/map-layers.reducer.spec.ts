/* tslint:disable:no-unused-variable */

/*!
 * Map Layers Reducer Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { async, inject } from '@angular/core/testing';
import { MapLayersReducer, LayerState } from './map-layers.reducer';
import { assign } from 'lodash';

describe('NgRx Store Reducer: Map Layers', () => {

  const initialState: LayerState = {
    ids: ['layer-1'],
    layers: {
      'layer-1': {
        id: 'layer-1',
        url: 'http://google.com.ph/',
        type: 'dummy-layer',
        layerOptions: {}
      }
    },
  };

  const blankState: LayerState = {
    ids: [],
    layers: {}
  };

  it('should create an instance', () => {
    expect(MapLayersReducer).toBeTruthy();
  });

  it('should return the current state when invalid action is supplied', () => {
    const actualState = MapLayersReducer(initialState, {
      type: 'INVALID_ACTION',
      payload: {
        id: 'layer-2',
        url: 'http://google.com.ph/',
        type: 'dummy-layer',
        layerOptions: {}
      }
    });

    expect(actualState).toBe(initialState);
  });

  it('should add the new layer', () => {
    const payload = {
      id: 'layer-2',
      url: 'http://google.com.ph/',
      type: 'dummy-layer',
      layerOptions: {}
    };

    const actualState = MapLayersReducer(initialState, {
      type: 'ADD_LAYER',
      payload
    });

    // check if layer-2 is in the array of ids
    expect(actualState.ids).toContain('layer-2');

    // check if layer-2 data is in the collection layer data
    expect(actualState.layers).toEqual(jasmine.objectContaining({
      'layer-2': payload
    }));
  });

  it('should clear all layers', () => {
    const payload = {
      id: 'layer-2',
      url: 'http://google.com.ph/',
      type: 'dummy-layer',
      layerOptions: {}
    };

    // add new layer
    let currentState = MapLayersReducer(blankState, {
      type: 'ADD_LAYER',
      payload
    });

    // remove all layers from the store
    currentState = MapLayersReducer(currentState, {
      type: 'REMOVE_ALL_LAYERS'
    });

    // check if ids length is 0
    expect(currentState.ids.length).toBe(0);

    // check if layers collection is empty
    expect(Object.keys(currentState.layers).length).toBe(0);
  });

});


