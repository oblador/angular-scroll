//
// test/midway/appSpec.js
//
describe("Midway: Testing Modules", function() {
  describe("duScroll Module:", function() {

    var module;
    before(function() {
      module = angular.module('duScroll');
    });

    it("should be registered", function() {
      expect(module).not.to.equal(null);
    });

    describe("Dependencies:", function() {

      var deps;
      var hasModule = function(m) {
        return deps.indexOf(m) >= 0;
      };
      before(function() {
        deps = module.value('duScroll').requires;
      });

      it("should have duScroll.scrollspy as a dependency", function() {
        expect(hasModule('duScroll.scrollspy')).to.equal(true);
      });

      it("should have duScroll.requestAnimation as a dependency", function() {
        expect(hasModule('duScroll.requestAnimation')).to.equal(true);
      });

      it("should have duScroll.smoothScroll as a dependency", function() {
        expect(hasModule('duScroll.smoothScroll')).to.equal(true);
      });

      it("should have duScroll.scrollContainer as a dependency", function() {
        expect(hasModule('duScroll.scrollContainer')).to.equal(true);
      });

      it("should have duScroll.scrollHelpers as a dependency", function() {
        expect(hasModule('duScroll.scrollHelpers')).to.equal(true);
      });
    });
  });
});
