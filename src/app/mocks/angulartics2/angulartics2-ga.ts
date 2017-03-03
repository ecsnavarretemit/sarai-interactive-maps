/*!
 * Angulartics2 (Mock)
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Inject } from '@angular/core';
import { Angulartics2, Angulartics2GoogleAnalytics } from 'angulartics2';

export class MockAngulartics2GoogleAnalytics extends Angulartics2GoogleAnalytics {

  // Inject the provided instance explicitly
  constructor(@Inject(Angulartics2) angulartics2: Angulartics2) {
    // pass the resolved instance to the parent class
    super(angulartics2);
  }

}


