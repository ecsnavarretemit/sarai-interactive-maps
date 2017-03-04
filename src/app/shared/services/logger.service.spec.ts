/* tslint:disable:no-unused-variable */

/*!
 * Logger Service Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { TestBed, async, inject } from '@angular/core/testing';
import { LoggerService, StreamData } from './logger.service';

describe('Service: Logger', () => {
  let subscription = null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoggerService]
    });
  });

  it('should instantiate the service', inject([LoggerService], (service: LoggerService) => {
    expect(service).toBeTruthy();
  }));

  it('should emit messages', async(inject([LoggerService], (service: LoggerService) => {
    const message = 'Hi this is a test message';

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


