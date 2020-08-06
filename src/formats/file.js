const fs = require( 'fs' );
const path = require( 'path' );

/**
 * Convert the report data to a JSON string.
 *
 * @param {Array<Array<Object>>} reports The list of report data.
 * @return {string} reports as a JSON string.
 */
module.exports = function( reports ) {
	const filename = path.join( __dirname, '../../result/colors.json' );
	
	try {
		const file = fs.openSync( filename, 'w' );
		
		fs.writeFileSync( filename, JSON.stringify( reports ) );
		
		console.log("File is created.");
	} catch (error) {
		console.log(error);
	}
	
	// return JSON.stringify( reports );
};
