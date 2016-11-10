/*!
 * Suitability Levels Reducer
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Action } from '@ngrx/store';
import { assign, map, omit, size, isArray, has, filter, reduce } from 'lodash';
import { SuitabilityLevel } from '../../map/suitability-level.interface';

export interface SuitabilityLevelsState {
  gridcodes: Array<number>;
  levels: {
    [id: string]: SuitabilityLevel
  };
}

const initialState: SuitabilityLevelsState = {
  gridcodes: [],
  levels: {}
};

export function SuitabilityLevelsReducer(state: SuitabilityLevelsState = initialState, action: Action): SuitabilityLevelsState {
  switch (action.type) {
    case 'ADD_SUITABILITY_LEVEL': {
      const level: SuitabilityLevel = action.payload;

      // if already existing return the current state
      if (state.gridcodes.indexOf(level.gridcode) > -1) {
        return state;
      }

      // return the new state
      return {
        gridcodes: [
          ...state.gridcodes,
          level.gridcode
        ],
        levels: assign({}, state.levels, {
          [level.gridcode]: level
        })
      };
    }

    case 'REMOVE_SUITABILITY_LEVEL': {
      // create new object based on the layers without the layer that matches the payload value
      const remainingLayers: any = omit(state.levels, action.payload);

      // return the initial state when
      if (size(remainingLayers) === 0) {
        return initialState;
      }

      // extract the remaining ids from the layers
      const gridcodes: any = map(remainingLayers, 'gridcode');

      // return the new state
      return {
        gridcodes: gridcodes,
        levels: remainingLayers
      };
    }

    case 'ADD_SUITABILITY_LEVELS': {
      if (!isArray(action.payload)) {
        return state;
      }

      const levels = action.payload;

      // remove the existing levels from the collection
      const newLevels = filter(levels, (level: SuitabilityLevel) => {
        return !has(state.levels, level.gridcode);
      });

      // extract the gridcodes from the suitability levels
      const newLevelGridcodes: any = map(newLevels, 'gridcode');

      // assemble the new object to match the data structure of the levels attribute of the state
      const newSuitabilityLevels: any = reduce(newLevels, (levels: { [id: string]: SuitabilityLevel }, level: SuitabilityLevel) => {
        return assign(levels, {
          [level.gridcode]: level
        });
      }, {});

      // return the new state
      return {
        gridcodes: [
          ...state.gridcodes,
          ...newLevelGridcodes
        ],

        levels: assign({}, state.levels, newSuitabilityLevels)
      };
    }

    case 'REMOVE_SUITABILITY_LEVELS':
      return initialState;

    default:
      return state;
  }
};


