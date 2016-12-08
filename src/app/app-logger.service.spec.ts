/* tslint:disable:no-unused-variable */

/*!
 * App Logger Service Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { TestBed, async, inject } from '@angular/core/testing';
import { AppLoggerService, StreamData } from './app-logger.service';

describe('Service: LeafletTileProvider', () => {
  let subscription = null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppLoggerService]
    });
  });

  it('should instantiate the service', inject([AppLoggerService], (service: AppLoggerService) => {
    expect(service).toBeTruthy();
  }));

  it('should emit messages', async(inject([AppLoggerService], (service: AppLoggerService) => {
    let message = 'Hi this is a test message';

    subscription = service
      .getMessageStream()
      .subscribe((data: StreamData) => {
        expect(data).toEqual(jasmine.objectContaining({
          message
        }));
      })
      ;

    service.write('New Message', 'log', message, true);
  })));

  afterAll(() => {
    if (subscription !== null) {
      subscription.unsubscribe();
    }
  });

});


