const fs = require( 'fs-extra' );
const path = require( 'path' );

const { getArgFromCLI } = require( '../utils/cli' );

module.exports = module.exports = function( reports ) {
    const reportName = getArgFromCLI('--report');
    
    if ( undefined === typeof reportName ) {
        return 'You must provide a report name in the `--report=` CLI argument.';
    }
    
    fs.mkdirpSync( '../reports/' );
    fs.writeFileSync( `../../reports/${reportName}.html`, 'hey' );
};

