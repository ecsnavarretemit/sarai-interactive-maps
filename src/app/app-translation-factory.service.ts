/*!
 * App Translation Factory Service
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Http } from '@angular/http';
import { TranslateStaticLoader } from 'ng2-translate';
import { environment } from '../environments/environment';

export function TranslationFactoryLoader(http: Http) {
  const translationConfig = environment.sarai_map_config.translations;

  return new TranslateStaticLoader(http, translationConfig.static.prefix, translationConfig.static.ext);
};


