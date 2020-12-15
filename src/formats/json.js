/**
 * Convert the report data to a JSON string.
 *
 * @param {Array<Array<Object>>} reports The list of report data.
 * @return {string} reports as a JSON string.
 */
module.exports = function ( reports ) {
	return JSON.stringify( reports.map( ( { results } ) => results ) );
};
