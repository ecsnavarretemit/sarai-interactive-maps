/*!
 * Map Layers Reducer
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { ActionReducer, Action } from '@ngrx/store';
import { assign, map, filter, isArray, has, omit, size, reduce, forEach } from 'lodash';
import { WMSOptions } from 'leaflet';

export interface Layer {
  id: string;
  url: string;
  type: string; // suitability-map-detailed, suitability-map-simplified, or other category
  data: {
    wmsOptions: WMSOptions
  };
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

export const MapLayersReducer: ActionReducer<LayerState> = (state: LayerState = initialState, action: Action) => {
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

      const layers = action.payload;

      // remove the existing layers from the object
      const newLayers = filter(layers, (layer: Layer) => {
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

    case 'ADD_CQL_FILTER_BY_ID': {
      // copy the layers to prevent any state modification
      const currentLayers = assign({}, state.layers);

      // if id does not exist, return the current state
      if (!has(currentLayers, action.payload.id)) {
        return state;
      }

      // save current wmsOptions of the layer
      let wmsOptions = currentLayers[action.payload.id].data.wmsOptions;

      // add the cql_filter
      currentLayers[action.payload.id].data.wmsOptions = assign({}, wmsOptions, {
        cql_filter: action.payload.cql_filter
      });

      return {
        ids: [...state.ids],
        layers: assign({}, state.layers, currentLayers)
      };
    }

    case 'REMOVE_CQL_FILTER_BY_ID': {
      // copy the layers to prevent any state modification
      const currentLayers = assign({}, state.layers);

      // if id does not exist, return the current state
      if (!has(currentLayers, action.payload)) {
        return state;
      }

      // remove the cql_filter from the options
      currentLayers[action.payload].data.wmsOptions = (omit(currentLayers[action.payload].data.wmsOptions, 'cql_filter') as any);

      return {
        ids: [...state.ids],
        layers: assign({}, state.layers, currentLayers)
      };
    }

    case 'ADD_CQL_FILTER_BY_TYPE': {
      // copy the layers to prevent any state modification
      const currentLayers = assign({}, state.layers);

      // get all layers that matches the type payload
      let layersToModify = filter(currentLayers, (layer: Layer) => {
        return layer.type === action.payload.type;
      });

      // return immediately if no layer's matched in the filter
      if (size(layersToModify) === 0) {
        return state;
      }

      forEach(layersToModify, (layer: Layer, key: string) => {
        // save current wmsOptions of the layer
        let wmsOptions = layer.data.wmsOptions;

        // add the cql_filter
        layersToModify[key].data.wmsOptions = assign({}, wmsOptions, {
          cql_filter: action.payload.cql_filter
        });
      });

      // assemble the new object to match the data structure of the layers attribute of the state
      const modifiedLayers: any = reduce(layersToModify, (layers: { [id: string]: Layer }, layer: Layer) => {
        return assign(layers, {
          [layer.id]: layer
        });
      }, {});

      return {
        ids: [...state.ids],
        layers: assign({}, state.layers, modifiedLayers)
      };
    }

    case 'REMOVE_CQL_FILTER_BY_TYPE': {
      // copy the layers to prevent any state modification
      const currentLayers = assign({}, state.layers);

      // get all layers that matches the type payload
      let layersToModify = filter(currentLayers, (layer: Layer) => {
        return layer.type === action.payload;
      });

      // return immediately if no layer's matched in the filter
      if (size(layersToModify) === 0) {
        return state;
      }

      forEach(layersToModify, (layer: Layer, key: string) => {
        // save current wmsOptions of the layer
        let wmsOptions = layer.data.wmsOptions;

        // remove the cql_filter
        layersToModify[key].data.wmsOptions = (omit(wmsOptions, 'cql_filter') as any);
      });

      // assemble the new object to match the data structure of the layers attribute of the state
      const modifiedLayers: any = reduce(layersToModify, (layers: { [id: string]: Layer }, layer: Layer) => {
        return assign(layers, {
          [layer.id]: layer
        });
      }, {});

      return {
        ids: [...state.ids],
        layers: assign({}, state.layers, modifiedLayers)
      };
    }

    default:
      return state;
  }
};


