/*!
 * Map State
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { ActionReducer, Action } from '@ngrx/store';

export const mapReducer: ActionReducer<any> = (state: any = {}, action: Action) => {
  switch (action.type) {
    case 'SET_TILE_PROVIDER':
      return Object.assign({}, state, action.payload);

    case 'SET_CENTER':
      return Object.assign({}, state, action.payload);

    case 'SET_ZOOM':
      return Object.assign({}, state, action.payload);

    default:
      return state;
  }
};


