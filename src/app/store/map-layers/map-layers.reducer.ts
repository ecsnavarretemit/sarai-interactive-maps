/*!
 * Map Layers Reducer
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Action } from '@ngrx/store';
import assign from 'lodash-es/assign';
import filter from 'lodash-es/filter';
import has from 'lodash-es/has';
import isArray from 'lodash-es/isArray';
import map from 'lodash-es/map';
import omit from 'lodash-es/omit';
import reduce from 'lodash-es/reduce';
import size from 'lodash-es/size';
import * as L from 'leaflet';

export interface Layer {
  id: string;
  url: string;
  type: string; // suitability-map-detailed, suitability-map-simplified, or other category
  layerOptions: L.TileLayerOptions | L.WMSOptions;
}

export interface LayerState {
  ids: Array<string>;
  layers: {
    [id: string]: Layer
  };
}

const initialState: LayerState = {
  ids: [],
  layers: {}
};

export function MapLayersReducer (state: LayerState = initialState, action: Action): LayerState {
  switch (action.type) {
    case 'ADD_LAYER': {
      const layer = action.payload;

      // if already existing return the current state
      if (state.ids.indexOf(layer.id) > -1) {
        return state;
      }

      // return the new state
      return {
        ids: [
          ...state.ids,
          layer.id
        ],
        layers: assign({}, state.layers, {
          [layer.id]: layer
        })
      };
    }

    case 'REMOVE_LAYER': {
      // create new object based on the layers without the layer that matches the payload value
      const remainingLayers: any = omit(state.layers, action.payload);

      // return the initial state when
      if (size(remainingLayers) === 0) {
        return initialState;
      }

      // extract the remaining ids from the layers
      const remainingIds: any = map(remainingLayers, 'id');

      // return the new state
      return {
        ids: remainingIds,
        layers: remainingLayers
      };
    }

    case 'ADD_LAYERS': {
      if (!isArray(action.payload)) {
        return state;
      }

      // remove the existing layers from the object
      const newLayers = filter(action.payload, (layer: Layer) => {
        return !has(state.layers, layer.id);
      });

      // extract the ids from the layers
      const newLayerIds: any = map(newLayers, 'id');

      // assemble the new object to match the data structure of the layers attribute of the state
      const newLayerLayers: any = reduce(newLayers, (layers: { [id: string]: Layer }, layer: Layer) => {
        return assign(layers, {
          [layer.id]: layer
        });
      }, {});

      // return the new state
      return {
        ids: [
          ...state.ids,
          ...newLayerIds
        ],

        layers: assign({}, state.layers, newLayerLayers)
      };
    }

    case 'REMOVE_ALL_LAYERS':
      return initialState;

    default:
      return state;
  }
};


