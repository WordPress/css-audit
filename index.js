/**
 * Node dependencies
 */
const fs = require( 'fs' );
const path = require( 'path' );

/**
 * Internal dependencies
 */
const { runAudits } = require( './src/run' );
const {
	getArg,
	getFileArgsFromCLI,
	getHelp,
} = require( './src/utils/cli' );

const config = require( './css-audit.config' );
const input = getFileArgsFromCLI();

if ( getArg( '--help', true ) || ! input.length ) {
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

const result = runAudits( config, cssFiles );

console.log( result );
