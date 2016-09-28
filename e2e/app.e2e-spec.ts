import { BugrapNgPage } from './app.po';

describe('bugrap-ng App', function() {
  let page: BugrapNgPage;

  beforeEach(() => {
    page = new BugrapNgPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
