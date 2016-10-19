/* tslint:disable:no-unused-variable */

/*!
 * Suitability Map Panel Component Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { TestBed, async, inject } from '@angular/core/testing';
import { SuitabilityMapPanelComponent } from './suitability-map-panel.component';
import { Router } from '@angular/router';

describe('Component: SuitabilityMapControls', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      Router,
      SuitabilityMapPanelComponent
    ]
  }));

  it('should create an instance', inject([SuitabilityMapPanelComponent], (component: SuitabilityMapPanelComponent) => {
    expect(component).toBeTruthy();
  }));
});


