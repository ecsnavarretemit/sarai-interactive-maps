/* tslint:disable:no-unused-variable */

/*!
 * NDVI Panel Component Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { TestBed, async, inject } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { MockRouter } from '../mocks/router';
import { NdviPanelComponent } from './ndvi-panel.component';

describe('Component: NdviPanel', () => {
  let mockRouter: MockRouter;

  beforeEach(() => {
    mockRouter = new MockRouter();

    TestBed.configureTestingModule({
      providers: [
        FormBuilder,
        NdviPanelComponent,
        { provide: Router, useValue: mockRouter }
      ]
    });
  });

  it('should create an instance', inject([NdviPanelComponent], (component: NdviPanelComponent) => {
    expect(component).toBeTruthy();
  }));

});


