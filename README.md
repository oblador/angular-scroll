angular-scroll
==============

Install
-------

    $ bower install angular-scroll

Usage
-----

```js
angular.module('myApp', ['duScroll']).
    controller('myCtrl', function($scope, scrollPosition){
        scrollPosition.observe(function(scrollY) {
            console.log('Scrolled to ', scrollY);
        });
    }
);
```

```html
<a href="#anchor" smooth-scroll>Scroll it!</a>
```

Building
--------

    $ grunt
