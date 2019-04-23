var sass = require('node-sass')

module.exports = function (source) {
	// Get all variable names and camelCase them.
	var varNames = getAllVariableNames(source).map(function (varName) {
		return {
			cssName: varName,
			jsName: camelize(varName),
		}
	})

	// Create a new source that has, appended to the original source, a list of
	// classes named the same as the camel cased variables, each of which has a
	// single property `value` that's set to the variable.
	var newSource = source + '\n' + varNames.reduce(function (src, name) {
		return src + '.' + name.jsName + '{value:$' + name.cssName + '}\n'
	}, '')

	// Compile the new source.
	var result = sass.renderSync({
		data: newSource,
		includePaths: [this.context],
		outputStyle: 'compressed',
	})
	var css = result.css.toString('utf-8')

	// Extract the values of the variables into a JS map.
	var retrieveValueRegExp = /\.(\w+)\{value:(.+?)\}/g
	var varMap = getAllMatches(retrieveValueRegExp, css)
		.reduce(function (map, matches) {
			var className = matches[0]
			var value = matches[1]

			map[className] = value
			return map
		}, {})

	return 'module.exports=' + JSON.stringify(varMap)
}

function getAllVariableNames(source) {
	var variableNameRegExp = /^\$([\w\-]+)/gm
	return getAllMatches(variableNameRegExp, source)
		.map(function (x) { return x[0] })
}

function getAllMatches(regexp, text) {
	var allMatches = []
	var result
	while ((result = regexp.exec(text)) !== null) {
		allMatches.push(result.slice(1))
	}

	return allMatches
}

function camelize(text) {
	var sectionStartRegExp = /((?:^\w)|(?:-\w))/g
	var result = text.replace(sectionStartRegExp, function (letter, index) {
		return letter.toUpperCase().replace('-', '')
	})

	return result[0].toLowerCase().concat(result.slice(1))
}
