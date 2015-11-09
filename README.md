# SASS to JS variable loader for Webpack

## Installation

`npm install --save-dev sass-to-js-var-loader`

## Description

This simple, stupid loader will find all variables in a SASS file and provide their compiled values in a JS object with the camel-cased variable names as the keys. This can be useful when you need to reference styling information within your JS files (hopefully a fairly rare occurance). 

## Example

**test.scss**
```
$foo: #f00;
$bar-baz: lighten(#444, 20%);
```

**test.js**
```
var variables = require('sass-to-js-var!./test.scss');

console.log(variables.foo);
console.log(variables.barBaz);
```

**Output**
```
#f00
#777777
```
