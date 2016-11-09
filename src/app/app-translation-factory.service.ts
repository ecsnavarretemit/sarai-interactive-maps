/*!
 * App Translation Factory Service
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Http } from '@angular/http';
import { TranslateStaticLoader } from 'ng2-translate';

export function TranslationFactoryLoader(http: Http) {
  return new TranslateStaticLoader(http, '/assets/i18n', '.json');
};


