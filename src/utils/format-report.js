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

module.exports = function( { label, value } ) {
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

	return `${ colors.green.bold( label ) }:\n\n${ valueString }\n\n`;
};
