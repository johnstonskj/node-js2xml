node-js2xml
===========

This provides a very simple JavaScript to XML module for [node.js][node], based on the [Genx][genx] package.

[node]: http://nodejs.org/
[genx]: http://www.tbray.org/ongoing/When/200x/2004/02/20/GenxStatus

The intent is only to provide a very basic serialization at this time, some options are available

Install
-------

The usual, [npm][npm], add a dependency in your package.json to 
<code>js2xml</code> and run:

    $ npm install
API
---

```javascript
var xml = require('js2xml');

var serialized = xml.toXml({name: 'example', version: 3}, {});
```

Examples
--------

TBD
