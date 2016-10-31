/*!
 * App Config
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { OpaqueToken } from '@angular/core';
import { environment } from '../environments/environment';

export let APP_CONFIG = new OpaqueToken('app.config');

export const AppConfig = environment.sarai_map_config;


