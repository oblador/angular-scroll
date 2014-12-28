var ContainerPage = (function () {
  var ptor = protractor.getInstance();

  function ContainerPage() {
    this.links        = element.all(By.css('nav a'));
    this.activeLinks  = element.all(By.css('nav a.active'));
    this.topButton    = element(By.css('footer button:first-child'));
  }

  ContainerPage.prototype.visitPage = function () {
    browser.get('/example/container.html');
  };

  ContainerPage.prototype.scrollToTop = function () {
    return this.topButton.click().then(function() {
      ptor.sleep(5000);
    });
  };

  ContainerPage.prototype.scrollToSection = function (nr) {
    return this.links.get(nr).click().then(function() {
      ptor.sleep(500);
    });
  };

  ContainerPage.prototype.scrollBackAndForth = function (nr) {
    var self = this;
    return self.links.get(nr).click().then(function() {
      ptor.sleep(100);
      return self.topButton.click().then(function() {
        ptor.sleep(100);
        return self.links.get(nr).click().then(function() {
          ptor.sleep(500);
        });
      });
    });
  };

  return ContainerPage;

})();

module.exports = ContainerPage;
