const { runAudits } = require( './src/run' );

const { getArgFromCLI } = require( './src/utils/cli' );

const config = getArgFromCLI( '--config' ) ? require( './css-audit.config' ) : false;

console.log( config );

const result = runAudits( config );

console.log( result );
