const fs = require( 'fs' );
const path = require( 'path' );

// Temporarily outputting to file from JSON arg for speed - will be --file
module.exports = function( reports ) {
	const filename = path.join( __dirname, '../../result/colors.json' );
	
	try {
		fs.openSync( filename, 'w' );
		
		fs.writeFileSync( filename, JSON.stringify( reports ) );
		
		return "File is created.";
	} catch (error) {
		console.log(error);
	}
	
};


/**
 * Convert the report data to a JSON string.
 *
 * @param {Array<Array<Object>>} reports The list of report data.
 * @return {string} reports as a JSON string.
 */
// module.exports = function( reports ) {
// 	return JSON.stringify( reports );
// };