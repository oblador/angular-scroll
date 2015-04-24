require('jasmine-given');

var pages = {
  DefaultPage: require('./pages/default-page'),
  ContainerPage: require('./pages/container-page')
};

describe('duScroll', function() {
  for(var pageName in pages) {
    describe(pageName, function() {
      var page = new pages[pageName]();
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

        if(pageName === 'DefaultPage') {
          //Omit this test for the container page since the first link is at the top
          it('should make all links inactive after scrolling to top', function() {
            page.scrollToTop().then(function() {
              expect(page.activeLinks.count()).toBe(0);
            });
          });
          it('should support elements with name instead of id attribute', function() {
            page.scrollToSection(1).then(function() {
              expect(page.activeLinks.count()).toBe(1);
              expect(page.links.get(1).getAttribute('class')).toBe('active');
            });
          });
          it('should support du-smooth-scroll attribute instead of href', function() {
            page.scrollToSection(2).then(function() {
              expect(page.activeLinks.count()).toBe(1);
              expect(page.links.get(2).getAttribute('class')).toBe('active');
            });
          });
        }

        it('should cancel all animations except the last one', function() {
          page.scrollBackAndForth(2).then(function() {
            expect(page.activeLinks.count()).toBe(1);
            expect(page.links.get(2).getAttribute('class')).toBe('active');
          });
        });
      });
    });
  }
});

