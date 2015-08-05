'use strict';

describe('defaults', function() {
  beforeEach(module('duScroll'));

  it('should should have a default scroll duration', inject(function(duScrollDuration) {
    expect(duScrollDuration).not.toBe(null);
  }));

  it('should should have a default easing function', inject(function(duScrollEasing) {
    expect(duScrollEasing).not.toBe(null);
  }));

  it('should have a default active class', inject(function(duScrollActiveClass) {
    expect(duScrollActiveClass).toEqual('active');
  }));
});
