const colors = require( 'colors' );
const Table = require( 'cli-table3' );

const tableSettings = {
	chars: {
		top: '-',
		'top-mid': '-',
		'top-left': ' ',
		'top-right': ' ',
		bottom: '-',
		'bottom-mid': '-',
		'bottom-left': ' ',
		'bottom-right': ' ',
		left: '|',
		'left-mid': '|',
		mid: '-',
		'mid-mid': '|',
		right: '|',
		'right-mid': '|',
		middle: '│',
	},
};

/**
 * Convert the report data to a JSON string.
 *
 * The report value can be as a plain string, an array, or an array of objects
 * to be rendered by `Table`. This expects the cli supports color output.
 *
 * @param {Object} report An indvidual audit result.
 * @param {string} report.label A human-readable string describing the results.
 * @param {string|string[]|Object[]} report.value The result for this audit.
 * @return {string} A formatted string for output on cli.
 */
function formatReport( { label, value } ) {
	let valueString = value;

	if ( Array.isArray( value ) && value.length ) {
		let table = '';
		if ( 'object' === typeof value[ 0 ] ) {
			tableSettings.head = Object.keys( value[ 0 ] );
			table = new Table( tableSettings );
			value.forEach( ( row ) => {
				table.push(
					Object.values( row ).map( ( item ) => {
						item = String( item );
						if ( item.length > 80 ) {
							return item.slice( 0, 80 ) + '…';
						}
						return item;
					} )
				);
			} );
		} else {
			table = new Table( tableSettings );
			value.forEach( ( row ) => {
				table.push( [ row ] );
			} );
		}

		valueString = table.toString();
	}

	return `${ colors.green.bold( label ) }:\n${ valueString }\n\n`;
}

/**
 * Convert the report data to a JSON string.
 *
 * @param {Array<Array<Object>>} reports The list of report data.
 * @return {string} reports as a JSON string.
 */
module.exports = function ( reports ) {
	reports.map( ( { results } ) => results );
	return reports.map( ( { name, results } ) => {
		return (
			`${ colors.magenta.bold( name ) }\n\n` +
			results.map( formatReport ).join( '' )
		);
	} );
};
