/* tslint:disable:no-unused-variable */

/*!
 * Spawn Modal Service Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { TestBed, async, inject } from '@angular/core/testing';
import { SpawnModalService } from './spawn-modal.service';

describe('Service: SpawnModal', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpawnModalService]
    });
  });

  it('should ...', inject([SpawnModalService], (service: SpawnModalService) => {
    expect(service).toBeTruthy();
  }));

});


