/*!
 * Map Config
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { OpaqueToken } from '@angular/core';
import { environment } from '../../environments/environment';

export let MAP_CONFIG = new OpaqueToken('map.config');

export const MapConfig = environment.app.map;


