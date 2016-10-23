/* tslint:disable:no-unused-variable */

/*!
 * Window Object Service Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { TestBed, async, inject } from '@angular/core/testing';
import { WindowService } from './window.service';

describe('Service: Window', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: WindowService, useValue: window }
      ]
    });
  });

  it('should ...', inject([WindowService], (service: Window) => {
    expect(service).toBeTruthy();
  }));
});


