/*!
 * Mock Router
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

// mock classes for router integration testing
// reference: <https://dzone.com/articles/getting-started-and-testing-with-angular-cli-and-angular-2-rc5-part-2>
export class MockActivatedRoute extends ActivatedRoute {
  params: Observable<Params>;

  constructor(parameters?: { [key: string]: any; }) {
    super();
    this.params = Observable.of(parameters);
  }

}


