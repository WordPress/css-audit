const fs = require( 'fs' );

/**
 * Internal dependencies
 */
const colors = require( './audits/colors' );
const important = require( './audits/important' );
const propertyValues = require( './audits/property-values' );
const selectors = require( './audits/selectors' );
const formatReport = require( './utils/format-report' );

const input = process.argv.slice( 2 );
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

const reports = [
	...colors( cssFiles ),
	...important( cssFiles ),
	...propertyValues( cssFiles, [ 'display' ] ),
	...selectors( cssFiles ),
];

// We'll use some formatter for displaying these.
console.log( reports.map( formatReport ).join( '\n' ) ); // eslint-disable-line no-console

process.exit( 0 );
