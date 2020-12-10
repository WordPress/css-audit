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
		return path.join(
			__dirname,
			'/__tests__/fixtures/css-audit.config.js'
		);
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

	if ( true === cliOnly ) {
		return false;
	}

	// TODO: replace with cosmiconfig.
	const config = ( () => {
		try {
			return require( configPath() );
		} catch {
			console.error(
				"Can't find config file. \nMake sure there is css-audit.config.js in the directory where you run this command."
			);
		}
	} )();

	const term = arg.substr( 2 );

	// This is a simple property: value arg e.g. format: json
	const argIsNotAnAudit = config.hasOwnProperty( term );

	if ( argIsNotAnAudit ) {
		return 'undefined' === typeof config[ term ]
			? true
			: config[ term ] || null;
	}

	if ( config.hasOwnProperty( 'audits' ) ) {
		// Separate the basic audits from property-values.
		const basicAudits = config[ 'audits' ].filter(
			( audit ) => term === audit && 'string' === typeof audit
		);

		// Create an array of values of the property-value audits.
		const propertyValueAudits = config[ 'audits' ].filter(
			( audit ) => 'object' === typeof audit && term === audit[ 0 ]
		);
		const propertyValueValues = ( () => {
			if ( propertyValueAudits.length > 0 ) {
				return propertyValueAudits
					.flat()
					.filter( ( item ) => 'property-values' !== item );
			}
			return [];
		} )();

		if ( 'undefined' !== basicAudits[ 0 ] && term === basicAudits[ 0 ] ) {
			return true;
		}

		if ( propertyValueValues.length > 0 ) {
			return propertyValueValues;
		}
	}

	// The argument cannot be retrieved from CLI or config.
	return false;
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
	getArg,
	getHelp,
};
