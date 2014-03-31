angular-scroll
==============

Only dependent on AngularJS (no jQuery). 3.4K minified or 0.7K gzipped.

Example
-------
Check out [the live demo](http://durated.github.io/angular-scroll/) or the [source code](https://github.com/durated/angular-scroll/blob/master/example/index.html).

Install
-------
With bower:

    $ bower install angular-scroll

Or download the [production version](https://raw.github.com/durated/angular-scroll/master/angular-scroll.min.js) or the [development version](https://raw.github.com/durated/angular-scroll/master/angular-scroll.js).

Usage
-----

### Scrolling observer
```js
angular.module('myApp', ['duScroll']).
  controller('MyCtrl', function($scope, $rootScope){
    $rootScope.$on('$duScrollChanged', function($event, scrollY) {
      console.log('Scrolled to ', scrollY);
    });
  }
);
```

### Smooth Anchor Scrolling
```html
<a href="#anchor" du-smooth-scroll>Scroll it!</a>
```

### Scrollspy
```html
<a href="#anchor" du-scrollspy>Am i active?</a>
```

#### Bootstrap
```html
<ul class="nav navbar-nav">
  <li du-scrollspy="anchor"><a href="#anchor">Link</a></li>
</ul>
```

#### Multiple spies on same target
```html
<ul du-spy-context class="nav navbar-nav">
  <li du-scrollspy="anchor"><a href="#anchor">Link</a></li>
</ul>
<ul du-spy-context class="nav navbar-nav">
  <li du-scrollspy="anchor"><a href="#anchor">Link</a></li>
</ul>
```


### Manual smooth scrollTo
```js
angular.module('myApp', ['duScroll']).
  controller('myCtrl', function(scroller) {
    var x = 0;
    var y = 400;
    var duration = 2000; //milliseconds

    //Scroll to the exact position
    scroller.scrollTo(x, y, duration);

    var chunk = 200;
    //Scroll 200px down from current scroll position
    scroller.scrollDelta(x, chunk, duration);

    var offset = 30; //pixels; adjust for floating menu, context etc
    //Scroll to #some-id with 30 px "padding"
    //Note: Use this in a directive, not with document.getElementById 
    scroller.scrollToElement(document.getElementById('some-id'), offset, duration);
  }
);
```

### Configuring scroll speed
Duration is defined in milliseconds.

To set a scroll duration on a single anchor:
```html
<a href="#anchor" du-smooth-scroll duration="5000">Scroll it!</a>
```

To change the default duration:
```js
angular.module('myApp', ['duScroll']).value('duScrollDuration', 5000);
```

### Configuring scroll easing
Set the `duScrollEasing` value to a function that takes and returns a value between 0 to 1.

```js
function invertedEasingFunction(x) {
  return 1-x;
}
angular.module('myApp', ['duScroll']).value('duScrollEasing', invertedEasingFunction);
```

### Scroll spy events

The `duScrollspy` directive fires the global events `duScrollspy:becameActive` and `duScrollspy:becameInactive` with an angular.element wrapped element as first argument. This is nice to have if you want the URL bar to reflect where on the page the visitor are, like this: 

```js
angular.module('myApp', ['duScroll']).
  config(function($locationProvider) {
    $locationProvider.html5Mode(true);
  }).
  run(function($rootScope, $location){
    $rootScope.$on('duScrollspy:becameActive', function($event, $element){
      //Automaticly update location
      var hash = $element.prop('hash');
      if(hash) {
        $location.hash(hash.substr(1)).replace();
        $rootScope.$apply();
      }
    });
  });
```

Building
--------

    $ grunt
