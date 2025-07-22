const { version } = require('../../package.json');

/**
 * Convert the report data to a JSON string.
 *
 * @param {Array<Array<Object>>} reports The list of report data.
 * @return {string} reports as a JSON string.
 */
module.exports = function ( reports ) {
	const output = {
		generatedAt: new Date().toISOString(),
		version,
		reports: reports.map( ( data ) => data ),
	};

	return JSON.stringify( output, null, 2 );
};
