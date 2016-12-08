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

  it('should make the suitability maps button contain btn--inverted class when clicked', () => {
    page.navigateTo();

    page.showSuitabilityMapsPanel();

    expect(page.getSuitabilityMapsButtonClass()).toMatch('btn--inverted');
  });

  it('should make the suitability map panel visible', () => {
    page.navigateTo();

    page.showSuitabilityMapsPanel();

    expect(page.getSuitabilityMapsPanelStyle('opacity')).toMatch('1');
  });

  it('should make the crop production area button contain btn--inverted class when clicked', () => {
    page.navigateTo();

    page.showCropProductionAreaPanel();

    expect(page.getCropProductionAreaButtonClass()).toMatch('btn--inverted');
  });

  it('should make the crop production area panel visible', () => {
    page.navigateTo();

    page.showCropProductionAreaPanel();

    expect(page.getCropProductionAreaPanelStyle('opacity')).toMatch('1');
  });

});


