import { SaraiNg2Page } from './app.po';

describe('sarai-ng2 App', function() {
  let page: SaraiNg2Page;

  beforeEach(() => {
    page = new SaraiNg2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
