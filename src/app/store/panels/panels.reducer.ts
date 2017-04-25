/*!
 * Suitability Levels Reducer
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Action } from '@ngrx/store';
import filter from 'lodash-es/filter';
import includes from 'lodash-es/includes';

export interface PanelsState {
  active: string;
  panels: string[];
}

const initialState: PanelsState = {
  active: null,
  panels: []
};

export function PanelsReducer(state: PanelsState = initialState, action: Action): PanelsState {
  switch (action.type) {
    case 'ADD_PANEL': {
      const panel: string = action.payload;

      // return immediately if the panels already contains the id of the panel
      if (includes(state.panels, panel)) {
        return state;
      }

      return {
        active: state.active,
        panels: [
          ...state.panels,
          panel
        ]
      };
    }

    case 'REMOVE_PANEL': {
      const panel: string = action.payload;

      // return immediately if the panel does not exist on the state
      if (!includes(state.panels, panel)) {
        return state;
      }

      const activePanel = (panel === state.active) ? null : state.active;
      const remainingPanels = filter(state.panels, (item) => {
        return item !== panel;
      });

      return {
        active: activePanel,
        panels: [
          ...remainingPanels
        ]
      };
    }

    case 'ACTIVATE_PANEL': {
      const panel: string = action.payload;

      // return immediately if the panel does not exist on the state
      if (!includes(state.panels, panel)) {
        return state;
      }

      return {
        active: panel,
        panels: [
          ...state.panels
        ]
      };
    }

    case 'DEACTIVATE_PANEL': {
      const panel: string = action.payload;
      let activePanel = state.active;

      if (typeof panel === 'undefined' || (typeof panel !== 'undefined' && state.active === panel)) {
        activePanel = null;
      }

      return {
        active: activePanel,
        panels: [
          ...state.panels
        ]
      }
    };

    default:
      return state;
  }
};


