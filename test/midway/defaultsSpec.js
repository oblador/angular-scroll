//
// test/midway/defaultsSpec.js
//
describe("Midway: Testing Defaults", function() {

  var tester;
  beforeEach(function() {
    tester = ngMidwayTester('duScroll');
  });

  afterEach(function() {
    tester.destroy();
    tester = null;
  });

  it("should should have a default scroll duration", function() {
    expect(tester.inject('duScrollDuration')).not.to.equal(null);
  });

  it("should should have a default easing function", function() {
    expect(tester.inject('duScrollEasing')).not.to.equal(null);
  });

});
