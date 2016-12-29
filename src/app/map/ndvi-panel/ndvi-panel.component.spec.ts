/* tslint:disable:no-unused-variable */

/*!
 * NDVI Panel Component Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Renderer } from '@angular/core';
import { TestBed, async, inject } from '@angular/core/testing';
import { LeafletMapService } from '../../leaflet';
import { NdviPanelComponent } from './ndvi-panel.component';

describe('Component: NdviPanel', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Renderer,
        LeafletMapService,
        NdviPanelComponent
      ]
    });
  });

  it('should create an instance', inject([NdviPanelComponent], (component: NdviPanelComponent) => {
    expect(component).toBeTruthy();
  }));

});


