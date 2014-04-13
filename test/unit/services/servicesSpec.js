describe("Unit: Testing Services", function() {

  beforeEach(angular.mock.module('duScroll'));

  it('should contain an requestAnimation service', inject(function(requestAnimation) {
    expect(requestAnimation).not.to.equal(null);
  }));

  it('should contain an scrollContainerAPI service', inject(function(scrollContainerAPI) {
    expect(scrollContainerAPI).not.to.equal(null);
  }));

  it('should contain an spyAPI service', inject(function(spyAPI) {
    expect(spyAPI).not.to.equal(null);
  }));

  describe('requestAnimation', function() {
    it('should call handler within 100ms', function(done) {inject(['requestAnimation',function(requestAnimation) {
      this.timeout(100);
      requestAnimation(function() { done(); })
    }])});
  });

  describe('scrollContainerAPI', function() {
    it('should default to $document', inject(['$rootScope', 'scrollContainerAPI', '$document' ,function($rootScope, containers, $document) {
      expect(containers.getContainer($rootScope)).to.equal($document);
    }]));
  });

  describe('spyAPI', function() {
    it('should return $id when creating a context', inject(['$rootScope', 'spyAPI' ,function($rootScope, spyAPI) {
      expect(spyAPI.createContext($rootScope)).to.equal($rootScope.$id);
    }]));

    it('should return a root context object by default', inject(['$rootScope', 'spyAPI' ,function($rootScope, spyAPI) {
      var testScope = $rootScope.$new();
      expect(spyAPI.getContextForScope(testScope)).to.equal(spyAPI.getContextForScope($rootScope));
    }]));

    it('should not return default context if specified', inject(['$rootScope', 'spyAPI' ,function($rootScope, spyAPI) {
      var testScope = $rootScope.$new();
      spyAPI.createContext(testScope);
      expect(spyAPI.getContextForScope(testScope)).to.not.equal(spyAPI.getContextForScope($rootScope));
    }]));

    it('should return parent scope context', inject(['$rootScope', 'spyAPI' ,function($rootScope, spyAPI) {
      var testScope = $rootScope.$new();
      var childScope = testScope.$new();
      expect(spyAPI.getContextForScope(childScope)).to.equal(spyAPI.getContextForScope(testScope));
    }]));

    it('should return default context when when destroyed', inject(['$rootScope', 'spyAPI' ,function($rootScope, spyAPI) {
      var testScope = $rootScope.$new();
      spyAPI.createContext(testScope);

      expect(spyAPI.getContextForScope(testScope)).to.not.equal(spyAPI.getContextForScope($rootScope));

      spyAPI.destroyContext(testScope);

      expect(spyAPI.getContextForScope(testScope)).to.equal(spyAPI.getContextForScope($rootScope));
    }]));
  });

});
