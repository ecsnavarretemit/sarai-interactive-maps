/*!
 * Application E2E Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { SaraiNg2Page } from './app.po';

describe('sarai-ng2 App', function() {
  let page: SaraiNg2Page;

  beforeEach(() => {
    page = new SaraiNg2Page();
  });

  it('should contain the text "Project SARAI"', () => {
    page.navigateTo();

    expect(page.getLogoTitle()).toEqual('Project SARAI');
  });

});


