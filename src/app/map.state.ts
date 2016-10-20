/*!
 * Map State
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { ActionReducer, Action } from '@ngrx/store';
import { assign, map, filter, isArray } from 'lodash';

export const mapReducer: ActionReducer<any> = (state: any = [], action: Action) => {
  switch (action.type) {
    case 'ADD_LAYER':
      return [
        ...state,
        assign({}, {
          id: action.payload.id,
          zoom: action.payload.zoom,
          url: action.payload.url,
          data: action.payload.data
        })
      ];

    case 'UPDATE_LAYER':
      return map(state, (layer: any) => {
        if (layer.id === action.payload.id) {
          let obj: any = {};

          if (typeof action.payload.id !== 'undefined') {
            obj.id = action.payload.id;
          }

          if (typeof action.payload.zoom !== 'undefined') {
            obj.zoom = action.payload.zoom;
          }

          if (typeof action.payload.url !== 'undefined') {
            obj.url = action.payload.url;
          }

          // prevent ovewriting data
          obj.data = assign({}, layer.data, action.payload.data);

          return assign({}, layer, obj);
        }

        return layer;
      });

    case 'REMOVE_LAYER':
      return filter(state, (layer: any) => {
        return layer.id !== action.payload;
      });

    case 'ADD_LAYERS':
      if (!isArray(action.payload)) {
        return state;
      }

      let newLayers = map(action.payload, (data: any) => {
        return assign({}, {
          id: data.id,
          zoom: data.zoom,
          url: data.url,
          data: data.data
        });
      });

      return [
        ...state,
        ...newLayers
      ];

    case 'UPDATE_LAYERS_BY_ZOOM':
      return map(state, (layer: any) => {
        if (layer.zoom === action.payload.zoom) {
          let obj: any = {};

          if (typeof action.payload.id !== 'undefined') {
            obj.id = action.payload.id;
          }

          if (typeof action.payload.zoom !== 'undefined') {
            obj.zoom = action.payload.zoom;
          }

          if (typeof action.payload.url !== 'undefined') {
            obj.url = action.payload.url;
          }

          // prevent ovewriting data
          obj.data = assign({}, layer.data, action.payload.data);

          return assign({}, layer, obj);
        }

        return layer;
      });

    case 'REMOVE_LAYERS_BY_ZOOM':
      return filter(state, (layer: any) => {
        return layer.zoom !== action.payload;
      });

    case 'REMOVE_ALL_LAYERS':
      return [];

    default:
      return state;
  }
};


