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
import { NdviPanelComponent } from './ndvi-panel.component';

describe('Component: NdviPanel', () => {

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      FormBuilder,
      Router,
      NdviPanelComponent
    ]
  }));

  it('should create an instance', inject([NdviPanelComponent], (component: NdviPanelComponent) => {
    expect(component).toBeTruthy();
  }));

});


