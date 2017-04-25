/* tslint:disable:no-unused-variable */

/*!
 * Crop Production Area Panel Component Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Renderer } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { AccordionModule } from 'ng2-bootstrap/accordion';
import { LeafletMapService } from '../../../../leaflet';
import { MockRouter } from '../../../../mocks/router';
import { PanelsReducer } from '../../../../store';
import { CropProductionAreaMapService } from '../../../shared';
import { CropProductionAreaPanelComponent } from './crop-production-area-panel.component';

describe('Component: CropProductionAreaPanel', () => {
  let mockRouter: MockRouter;

  beforeEach(() => {
    mockRouter = new MockRouter();

    TestBed.configureTestingModule({
      providers: [
        Renderer,
        LeafletMapService,
        CropProductionAreaMapService,
        CropProductionAreaPanelComponent,

        { provide: Router, useValue: mockRouter },
        provideStore({
          panels: PanelsReducer
        })
      ]
    });
  });

  it('should create an instance', inject([CropProductionAreaPanelComponent], (component: CropProductionAreaPanelComponent) => {
    expect(component).toBeTruthy();
  }));

});


