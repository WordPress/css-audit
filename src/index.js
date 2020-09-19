/**
 * Node dependencies
 */
const fs = require( 'fs' );
const path = require( 'path' );

/**
 * Internal dependencies
 */
const { formatReport } = require( './utils/format-report' );
const { getArgFromCLI, getFileArgsFromCLI, getHelp } = require( './utils/cli' );

const input = getFileArgsFromCLI();
if ( getArgFromCLI( '--help' ) || ! input.length ) {
	console.log( getHelp() ); // eslint-disable-line no-console
	process.exit( 0 );
}

const cssFiles = [];
input.forEach( ( file ) => {
	const filePath = path.resolve( process.env.INIT_CWD, file );
	const stats = fs.statSync( filePath );
	if ( stats.isDirectory() ) {
		return;
	}
	if ( file.match( /min\.css$/ ) ) {
		return;
	}
	cssFiles.push( {
		name: file,
		content: String( fs.readFileSync( filePath ) ),
	} );
} );

const runAll = getArgFromCLI( '--all' );
const runRecommended = getArgFromCLI( '--recommended' );

const runColors = runAll || runRecommended || getArgFromCLI( '--colors' );
const runImportant = runAll || runRecommended || getArgFromCLI( '--important' );
const runDisplayNone = runAll || getArgFromCLI( '--display-none' );
const runSelectors = runAll || runRecommended || getArgFromCLI( '--selectors' );
const runPropertyValues = !! getArgFromCLI( '--property-values' );
const runMediaQueries =
	runAll || runRecommended || getArgFromCLI( '--media-queries' );

const audits = [
	runColors && require( './audits/colors' )( cssFiles ),
	runImportant && require( './audits/important' )( cssFiles ),
	runDisplayNone && require( './audits/display-none' )( cssFiles ),
	runSelectors && require( './audits/selectors' )( cssFiles ),
	runPropertyValues &&
		require( './audits/property-values' )(
			cssFiles,
			getArgFromCLI( '--property-values' ).split( ',' )
		),
	runMediaQueries && require( './audits/media-queries' )( cssFiles ),
];

const reports = audits.flat().filter( Boolean );

console.log( formatReport( reports, getArgFromCLI( '--format' ) ) ); // eslint-disable-line no-console

process.exit( 0 );
