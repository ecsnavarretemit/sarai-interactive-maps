/*!
 * Application E2E Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { SaraiInteractiveMapsPage } from './app.po';

// TODO: replace `.then(done)` calls to `.finally(done)` when the webdriver ts definitions get updated.
// TODO: remove `--no-webdriver-update` from the e2e npm script.
describe('sarai-interactive-maps App', function() {
  let page: SaraiInteractiveMapsPage;

  beforeEach(() => {
    page = new SaraiInteractiveMapsPage();
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

  it('should make the suitability map panel visible', (done) => {
    page.navigateTo();

    page
      .showSuitabilityMapsPanel()
      .then(() => {
        return page.getSuitabilityMapsPanelStyle('opacity');
      })
      .then((opacity) => {
        expect(parseFloat(opacity)).toBeGreaterThan(0);
      })
      .then(done)
      ;
  });

  it('should make the crop production area button contain btn--inverted class when clicked', () => {
    page.navigateTo();

    page.showCropProductionAreaPanel();

    expect(page.getCropProductionAreaButtonClass()).toMatch('btn--inverted');
  });

  it('should make the crop production area panel visible', (done) => {
    page.navigateTo();

    page
      .showCropProductionAreaPanel()
      .then(() => {
        return page.getCropProductionAreaPanelStyle('opacity');
      })
      .then((opacity) => {
        expect(parseFloat(opacity)).toBeGreaterThan(0);
      })
      .then(done)
      ;
  });

  it('should make the ndvi button contain btn--inverted class when clicked', () => {
    page.navigateTo();

    page.showNdviPanel();

    expect(page.getNdviButtonClass()).toMatch('btn--inverted');
  });

  it('should make the ndvi panel visible', (done) => {
    page.navigateTo();

    page
      .showNdviPanel()
      .then(() => {
        return page.getNdviPanelStyle('opacity');
      })
      .then((opacity) => {
        expect(parseFloat(opacity)).toBeGreaterThan(0);
      })
      .then(done)
      ;
  });

  it('should make the rainfall map button contain btn--inverted class when clicked', () => {
    page.navigateTo();

    page.showRainfallMapPanel();

    expect(page.getRainfallMapButtonClass()).toMatch('btn--inverted');
  });

  it('should make the rainfall map panel visible', (done) => {
    page.navigateTo();

    page
      .showRainfallMapPanel()
      .then(() => {
        return page.getRainfallMapPanelStyle('opacity');
      })
      .then((opacity) => {
        expect(parseFloat(opacity)).toBeGreaterThan(0);
      })
      .then(done)
      ;
  });

});


