const FMT_CLI_TABLE = 'cli-table';
const FMT_JSON = 'json';
const FMT_HTML = 'html';

/**
 * Format the reports using the specified reporter format.
 *
 * @param {Array<Array<Object>>} reports The list of report data.
 * @param {FMT_CLI_TABLE|FMT_JSON} format One of the predefined formats. Defaults to FMT_CLI_TABLE.
 * @return {string} The formatted reports.
 */
function formatReport( reports, format = FMT_CLI_TABLE ) {
	let formatCallback = false;
	switch ( format ) {
		case FMT_JSON:
			formatCallback = require( '../formats/json' );
			break;
		case FMT_HTML:
			formatCallback = require( '../formats/html' );
			break;
		case FMT_CLI_TABLE:
		default:
			formatCallback = require( '../formats/cli-table' );
	}

	const formattedReports = formatCallback( reports );
	if ( Array.isArray( formattedReports ) ) {
		return formattedReports.join( '\n' );
	}

	return formattedReports;
}

module.exports = {
	formats: [ FMT_CLI_TABLE, FMT_JSON ],
	formatReport,
};
