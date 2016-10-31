/* tslint:disable:no-unused-variable */

/*!
 * Suitability Levels Reducer Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { async, inject } from '@angular/core/testing';
import { SuitabilityLevelsReducer, SuitabilityLevelsState } from './suitability-levels.reducer';

describe('NgRx Store Reducer: Suitability Levels', () => {

  const initialState: SuitabilityLevelsState = {
    gridcodes: [10],
    levels: {
      '10': {
        gridcode: 10,
        category: 'S1',
        name: 'Highly Suitable',
        slug: 'highly-suitable'
      }
    }
  };

  const blankState: SuitabilityLevelsState = {
    gridcodes: [],
    levels: {}
  };

  it('should create an instance', () => {
    expect(SuitabilityLevelsReducer).toBeTruthy();
  });

  it('should return the current state when invalid action is supplied', () => {
    const actualState = SuitabilityLevelsReducer(initialState, {
      type: 'INVALID_ACTION',
      payload: {
        gridcode: 21,
        category: 'S2 E',
        name: 'Moderately Suitable with limitation in elevation',
        slug: 'moderately-suitable-with-limitation-in-elevation'
      }
    });

    expect(actualState).toBe(initialState);
  });

  it('should add the new layer', () => {
    const payload = {
      gridcode: 21,
      category: 'S2 E',
      name: 'Moderately Suitable with limitation in elevation',
      slug: 'moderately-suitable-with-limitation-in-elevation'
    };

    const actualState = SuitabilityLevelsReducer(initialState, {
      type: 'ADD_SUITABILITY_LEVEL',
      payload
    });

    // check if 21 is in the array of gridcods
    expect(actualState.gridcodes).toContain(21);

    // check if gridcode 21 data is in the collection gridcode data
    expect(actualState.levels).toEqual(jasmine.objectContaining({
      '21': payload
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
    let currentState = SuitabilityLevelsReducer(blankState, {
      type: 'ADD_SUITABILITY_LEVEL',
      payload
    });

    // remove all layers from the store
    currentState = SuitabilityLevelsReducer(currentState, {
      type: 'REMOVE_SUITABILITY_LEVELS'
    });

    // check if ids length is 0
    expect(currentState.gridcodes.length).toBe(0);

    // check if layers collection is empty
    expect(Object.keys(currentState.levels).length).toBe(0);
  });

});


