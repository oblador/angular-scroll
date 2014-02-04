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

Building
--------

    $ grunt
