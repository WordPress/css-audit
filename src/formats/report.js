const fs = require( 'fs-extra' );
const path = require( 'path' );

const { getArgFromCLI } = require( '../utils/cli' );

module.exports = module.exports = function( reports ) {
	const reportName = getArgFromCLI('--report');
	const reportDest = path.join( __dirname, `../../public/${reportName}.html` );
	
	if ( undefined === typeof reportName ) {
		return 'You must provide a report name in the `--report=` CLI argument.';
	}

	fs.writeFileSync( reportDest, JSON.stringify(reports) );
};

