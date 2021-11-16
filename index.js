const sass = require('sass')

module.exports = function (source) {
	// Get all variable names and camelCase them.
	const varNames = getAllVariableNames(source).map(function (varName) {
		return {
			cssName: varName,
			jsName: camelize(varName),
		}
	})

	// Create a new source that has, appended to the original source, a list of
	// classes named the same as the camel cased variables, each of which has a
	// single property `value` that's set to the variable.
	const newSource = source + '\n' + varNames.reduce(function (src, name) {
		return src + '.' + name.jsName + '{value:$' + name.cssName + '}\n'
	}, '')

	// Compile the new source.
	const result = sass.renderSync({
		data: newSource,
		includePaths: [this.context],
		outputStyle: 'compressed',
	})
	const css = result.css.toString('utf-8')

	// Extract the values of the variables into a JS map.
	const retrieveValueRegExp = /\.(\w+){value:(.+?)}/g
	const varMap = getAllMatches(retrieveValueRegExp, css)
		.reduce(function (map, matches) {
			const [className, value] = matches

			map[className] = value
			return map
		}, {})

	return 'module.exports=' + JSON.stringify(varMap)
}

function getAllVariableNames(source) {
	const variableNameRegExp = /^\$([\w\-]+)/gm
	return getAllMatches(variableNameRegExp, source)
		.map(function (x) { return x[0] })
}

function getAllMatches(regexp, text) {
	const allMatches = []
	let result
	while ((result = regexp.exec(text)) !== null) {
		allMatches.push(result.slice(1))
	}

	return allMatches
}

function camelize(text) {
	const sectionStartRegExp = /((?:^\w)|(?:-\w))/g
	const result = text.replace(sectionStartRegExp, function (letter) {
		return letter.toUpperCase().replace('-', '')
	})

	return result[0].toLowerCase().concat(result.slice(1))
}
