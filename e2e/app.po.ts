/*!
 * Application E2E Page Object
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { browser, element, by } from 'protractor';

export class SaraiNg2Page {

  navigateTo() {
    return browser.get('/');
  }

  getLogoTitle() {
    return element(by.css('app-root #logo > span')).getAttribute('innerText');
  }

}


