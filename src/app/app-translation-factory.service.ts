/*!
 * App Translation Factory Service
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Http } from '@angular/http';
import { TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function TranslationFactoryLoader(http: Http, appConfig: any): TranslateLoader {
  const { prefix, ext } = appConfig.translations.static;

  return new TranslateHttpLoader(http, prefix, ext);
};


