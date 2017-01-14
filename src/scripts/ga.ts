/*!
 * Google Analytics
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { environment } from '../environments/environment';

((window) => {
  let ga = (window as any).ga;
  let mode = 'none';

  if (environment.production === true && location.hostname !== 'localhost') {
    mode = 'auto';
  }

  // call the google analytics
  if (typeof ga !== 'undefined' && environment.ga.code !== '') {
    ga('create', environment.ga.code, mode);
  }
})(window);


