/**
 * External dependencies
 */
const path = require( 'path' );
const minimist = require( 'minimist' );

const getArgsFromCLI = ( excludePrefixes ) => {
	const args = process.argv.slice( 2 );
	if ( excludePrefixes ) {
		return args.filter( ( arg ) => {
			return ! excludePrefixes.some( ( prefix ) =>
				arg.startsWith( prefix )
			);
		} );
	}
	return args;
};

const getFileArgsFromCLI = () => minimist( getArgsFromCLI() )._;

/**
 * Get the value of a term from the configuration object.
 *
 * For each entry in configuration:
 * If is a key for the term, return its value.
 * If the term is present in the list of audits, return true.
 * If the term is in an array in the list of audits, return
 * the second item in the array, which will be the value.
 *
 * @param {object} config
 * @param {string} term
 */
const getValue = ( config, term ) => {
	for ( const key in config ) {
		if ( config.hasOwnProperty( key ) ) {
			if ( term === key ) {
				return 'undefined' === typeof config[ term ]
					? true
					: config[ term ];
			}
		}
		if ( 'object' === typeof config[ key ] ) {
			return getValueFromList( config[ key ], term );
		}
	}
};

/**
 * Get the config value for audit types that require an argument,
 * e.g. property-values.
 *
 * Given an array and a term, return true if the term is in
 * the array, and if the term is not in the array and there is
 * a nested array, return the second item of the array who's
 * first item is the term.
 *
 * getValueFromList(
 * 	[ 'term', [ 'term-2', 'value' ] ],
 * 	'term'
 * ) - returns true
 *
 * getValueFromList(
 * 	[ 'term', [ 'term-2', 'value' ] ],
 * 	'term-2'
 * ) - returns 'value'
 *
 * @param {array} list
 * @param {string} term
 */
const getValueFromList = ( list, term ) => {
	if ( 0 === list.length ) {
		return false;
	}

	const currItem = list[ 0 ];

	if ( term === currItem ) {
		return true;
	}

	if ( term === currItem[ 0 ] ) {
		return currItem[ 1 ];
	}

	list.shift();

	return getValueFromList( list, term );
};

/**
 * Get the argument required for running the audit,
 *
 * First get the argument from CLI, and fallback to the
 * config if its not present.
 *
 * @param {string} arg
 */

const getArg = ( arg ) => {
	// Maybe we don't want to hard code this? Allow for other file names?
	const config = require( path.join( process.cwd(), 'css-audit.config.js' ) );

	for ( const cliArg of getArgsFromCLI() ) {
		const [ name, value ] = cliArg.split( '=' );
		if ( name === arg ) {
			return 'undefined' === typeof value ? true : value || null;
		}
	}

	return getValue( config, arg.substr( 2 ) );
};

const getHelp = () => {
	return `Usage: css-audit -- <files...> [options]

--colors          Run colors audit.
--important       Run !important audit.
--display-none    Run display: none audit.
--selectors       Run selectors audit.
--media-queries   Run media queries audit.
--property-values Run audit for a given set of property values, comma-separated.
--recommended     Run recommended audits (colors, important, selectors). Default: true.
--all             Run all audits (except property values, as it requires a value).
--format          Format to use for displaying report.
--help            Show this message.
`;
};

module.exports = {
	getArgsFromCLI,
	getFileArgsFromCLI,
	getValue,
	getValueFromList,
	getArg,
	getHelp,
};
