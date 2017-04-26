/*!
 * Mock Router
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Observable } from 'rxjs/Observable';

// mock classes for router integration testing
// reference: <https://dzone.com/articles/getting-started-and-testing-with-angular-cli-and-angular-2-rc5-part-2>
export class MockRouter {
  navigate = jasmine.createSpy('navigate');

  get events(): Observable<any> {
    return Observable.of({
      id: 1,
      url: '/test-url'
    });
  }
}


