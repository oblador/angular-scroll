var DefaultPage = (function () {
  var ptor = protractor.getInstance();

  function DefaultPage() {
    this.links        = element.all(By.css('nav a'));
    this.activeLinks  = element.all(By.css('nav a.active'));
    this.topButton    = element(By.css('footer button'));
  }

  DefaultPage.prototype.visitPage = function () {
    browser.get('/example/index.html');
  };

  DefaultPage.prototype.scrollToTop = function () {
    return this.topButton.click().then(function() {
      ptor.sleep(5000);
    });
  };

  DefaultPage.prototype.scrollToSection = function (nr) {
    return this.links.get(nr).click().then(function() {
      ptor.sleep(500);
    });
  };

  return DefaultPage;

})();

module.exports = DefaultPage;
