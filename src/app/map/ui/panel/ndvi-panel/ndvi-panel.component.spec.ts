/* tslint:disable:no-unused-variable */

/*!
 * NDVI Panel Component Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Renderer } from '@angular/core';
import { TestBed, async, inject } from '@angular/core/testing';
import { provideStore } from '@ngrx/store';
import { LeafletMapService } from '../../../../leaflet';
import { PanelsReducer } from '../../../../store';
import { NdviPanelComponent } from './ndvi-panel.component';

describe('Component: NdviPanel', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Renderer,
        LeafletMapService,
        NdviPanelComponent,
        provideStore({
          panels: PanelsReducer
        })
      ]
    });
  });

  it('should create an instance', inject([NdviPanelComponent], (component: NdviPanelComponent) => {
    expect(component).toBeTruthy();
  }));

});


