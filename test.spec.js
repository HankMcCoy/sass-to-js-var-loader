var loader = require('.')

var result = loader('$foo: #123;\n' +
	'$bar-baz: lighten(#800, 20%);')

var expected = 'module.exports={"foo":"#123","barBaz":"#e00"}'

if (result !== expected) {
	throw new Error(
		'Expected: ' + expected + '\n' +
			'Received: ' + result
	)
}
