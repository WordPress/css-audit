#!/usr/bin/env node
'use strict';

const fs = require( 'fs' );

/**
 * Internal dependencies
 */
const { formatReport } = require( '../src/utils/format-report' );
const { getArgFromCLI, getFileArgsFromCLI, getHelp } = require( '../src/utils/cli' );

const input = getFileArgsFromCLI();
if ( getArgFromCLI( '--help' ) || ! input.length ) {
	// Download css from svn…
	// `svn export https://develop.svn.wordpress.org/trunk/src/wp-admin/css --depth files`
	console.log( getHelp() ); // eslint-disable-line no-console
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
	runColors && require( '../src/audits/colors' )( cssFiles ),
	runImportant && require( '../src/audits/important' )( cssFiles ),
	runDisplayNone && require( '../src/audits/display-none' )( cssFiles ),
	runSelectors && require( '../src/audits/selectors' )( cssFiles ),
	runPropertyValues &&
		require( '../src/audits/property-values' )(
			cssFiles,
			getArgFromCLI( '--property-values' ).split( ',' )
		),
	runMediaQueries && require( '../src/audits/media-queries' )( cssFiles ),
];

const reports = audits.flat().filter( Boolean );

console.log( formatReport( reports, getArgFromCLI( '--format' ) ) ); // eslint-disable-line no-console

process.exit( 0 );
