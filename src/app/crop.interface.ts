/*!
 * Crop Interface
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

export interface Crop {
  name: string;
  slug: string;
  subcrops?: Array<Crop>;
}


