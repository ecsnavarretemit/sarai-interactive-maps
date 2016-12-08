/*!
 * Application E2E Page Object
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { browser, element, by } from 'protractor';

export class SaraiNg2Page {
  public suitabilityMapsBtn = element(by.css('app-leaflet-button .map__control--suitability-map button'));

  navigateTo() {
    return browser.get('/');
  }

  getLogoTitle() {
    return element(by.css('app-root #logo > span')).getAttribute('innerText');
  }

  showSuitabilityMapsPanel() {
    return this.suitabilityMapsBtn.click();
  }

  getSuitabilityMapsButtonClass() {
    return this.suitabilityMapsBtn.getAttribute('class');
  }

}


