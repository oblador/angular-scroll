require('protractor/jasminewd');
require('jasmine-given');

var DefaultPage = require('./pages/default-page');

describe('duScroll', function() {
  var page = new DefaultPage();
  var ptor = protractor.getInstance();
  page.visitPage();

  describe('duScrollspy', function() {

    beforeEach(function() {
      page.visitPage();
    });

    it('should have a section 1 link', function() {
      expect(page.links.count()).toBe(4);
      expect(page.links.first().getText()).toMatch(/Section 1/);
    });

    it('should make the section 1 link active after clicking it', function() {
      page.scrollToSection(0).then(function() {
        expect(page.activeLinks.count()).toBe(1);
        expect(page.links.get(0).getAttribute('class')).toBe('active');
      });
    });

    it('should make all links inactive after scrolling to top', function() {
      page.scrollToTop().then(function() {
        expect(page.activeLinks.count()).toBe(0);
      });
    });
  });
});

