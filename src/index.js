const fs = require( 'fs' );

/**
 * Internal dependencies
 */
const { formatReport, formats } = require( './utils/format-report' );

const argv = require( 'yargs' )
	.usage( 'Usage: $0 <files...> [options]' )
	.demandCommand( 1 )
	.describe( 'colors', 'Run colors audit.' )
	.describe( 'important', 'Run !important audit.' )
	.describe( 'display-none', 'Run display: none audit.' )
	.describe( 'selectors', 'Run selectors audit.' )
	.describe(
		'recommended',
		'Run recommended audits (colors, important, selectors).'
	)
	.default( 'recommended', true )
	.describe( 'all', 'Run all audits (except property values).' )
	.describe(
		'property-values',
		'Run audit for a given set of property values, comma-separated.'
	)
	.describe(
		'format',
		`Format to use for displaying report: ${ formats.join( ', ' ) }`
	)
	.default( 'format', formats[ 0 ] )
	.boolean( [
		'colors',
		'display-none',
		'important',
		'selectors',
		'recommended',
		'all',
	] ).argv;

const input = argv._;
if ( ! input.length ) {
	// Download css from svn…
	// `svn export https://develop.svn.wordpress.org/trunk/src/wp-admin/css --depth files`
	process.exit( 0 );
}

const cssFiles = [];
input.forEach( ( file ) => {
	const stats = fs.statSync( file );
	if ( stats.isDirectory() ) {
		return;
	}
	if ( file.match( /min\.css$/ ) ) {
		return;
	}
	cssFiles.push( {
		name: file,
		content: String( fs.readFileSync( file ) ),
	} );
} );

const runColors = argv.all || argv.recommended || argv.colors;
const runImportant = argv.all || argv.recommended || argv.important;
const runDisplayNone = argv.all || argv[ 'display-none' ];
const runSelectors = argv.all || argv.recommended || argv.selectors;
const runPropertyValues = !! argv[ 'property-values' ];

const audits = [
	runColors && require( './audits/colors' )( cssFiles ),
	runImportant && require( './audits/important' )( cssFiles ),
	runDisplayNone && require( './audits/display-none' )( cssFiles ),
	runSelectors && require( './audits/selectors' )( cssFiles ),
	runPropertyValues &&
		require( './audits/property-values' )(
			cssFiles,
			argv[ 'property-values' ].split( ',' )
		),
];

const reports = audits.flat().filter( Boolean );

console.log( formatReport( reports, argv.format ) ); // eslint-disable-line no-console

process.exit( 0 );
