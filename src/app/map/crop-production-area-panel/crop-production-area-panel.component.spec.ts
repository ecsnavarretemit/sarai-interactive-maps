/* tslint:disable:no-unused-variable */

/*!
 * Crop Production Area Panel Component Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Renderer } from '@angular/core';
import { TestBed, async, inject } from '@angular/core/testing';
import { LeafletMapService } from '../../leaflet';
import { CropProductionAreaPanelComponent } from './crop-production-area-panel.component';

describe('Component: CropProductionAreaPanel', () => {

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      LeafletMapService,
      Renderer,
      CropProductionAreaPanelComponent
    ]
  }));

  it('should create an instance', inject([CropProductionAreaPanelComponent], (component: CropProductionAreaPanelComponent) => {
    expect(component).toBeTruthy();
  }));

});


