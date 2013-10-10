angular-scroll
==============

Install
-------

    $ bower install angular-scroll

Usage
-----

### Scrolling observer
```js
angular.module('myApp', ['duScroll']).
  controller('myCtrl', function($scope, scrollPosition){
    scrollPosition.observe(function(scrollY) {
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
  }
);
```

Building
--------

    $ grunt
