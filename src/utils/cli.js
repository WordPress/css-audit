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
 * Get the config value for audit types that require an argument,
 * e.g. property-values.
 *
 * Given an array and a term, return true if the term is in
 * the array, and if the term is not in the array and there is
 * a nested array, return the second item of the array who's
 * first item is the term.
 *
 * getValueFromConfigList(
 * 	[ 'term', [ 'term-2', 'value' ] ],
 * 	'term'
 * ) - returns true
 *
 * getValueFromConfigList(
 * 	[ 'term', [ 'term-2', 'value' ] ],
 * 	'term-2'
 * ) - returns 'value'
 *
 * @param {array} list
 * @param {string} term
 */
const getValueFromConfigList = ( list, term ) => {
	if ( 0 === list.length ) {
		return false;
	}

	const currItem = list[ 0 ];
	const listCopy = ( () => list )();

	if ( term === currItem ) {
		return true;
	}

	if ( term === currItem[ 0 ] ) {
		return currItem[ 1 ];
	}

	listCopy.shift();

	return getValueFromConfigList( listCopy, term );
};

/**
 * Get the argument required for running the audit,
 *
 * First get the argument from CLI, and fallback to the
 * config if its not present.
 *
 * @param {string} arg
 * @param {bool} cliOnly
 */

// TODO: we can use cosmiconfig for this
const configPath = () => {
	if ( 'test' === process.env.NODE_ENV ) {
		return path.join( __dirname, '/__tests__/fixtures/css-audit.config.js' );
	}

	return path.join( process.cwd(), 'css-audit.config.js' );
};

const getArg = ( arg, cliOnly = false ) => {

	for ( const cliArg of getArgsFromCLI() ) {
		const [ name, value ] = cliArg.split( '=' );

		if ( name === arg ) {
			return 'undefined' === typeof value ? true : value || null;
		}
	}

	if ( ! cliOnly ) {

		const config = ( () => {
			try {
				return require( configPath() ) ;
			} catch {
				console.error( 'Can\'t find config file. \nMake sure there is css-audit.config.js in the directory where you run this command.' );
			}
		} )();

		const term = arg.substr( 2 );

		if ( config.hasOwnProperty( term ) ) {
			return 'undefined' === typeof config[term] ? true : config[term] || null;
		}

		let result = false;

		if ( config.hasOwnProperty( 'audits' ) ) {

			for (let index = 0; index < config['audits'].length; index++) {
				const audit = config['audits'][index];

				// It is an array
				if ( 'object' === typeof audit ) {
					const list = ( () => audit )();

					result = getValueFromConfigList( list, term );
					break;
				}

				if ( term === audit ) {
					result = true;
					break;
				}
			}

		}

		return result;
	}

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
	getValueFromConfigList,
	getArg,
	getHelp,
};
