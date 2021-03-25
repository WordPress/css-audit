/**
 * External dependencies
 */
const { parse } = require( 'postcss' );

const { getSpecificityArray } = require( '../utils/get-specificity' );

module.exports = function ( files = [] ) {
	// let longest = 0;
	const selectors = [];

	files.forEach( ( { name, content } ) => {
		const root = parse( content, { from: name } );
		root.walkRules( function ( { selector } ) {
			const selectorList = selector.split( ',' );
			selectorList.forEach( ( selectorName ) => {
				// Remove excess whitespace from selectors.
				selectorName = selectorName.replace( /\s+/g, ' ' ).trim();
				const [ a, b, c ] = getSpecificityArray( selectorName );
				const sum = 100 * a + 10 * b + c; // eslint-disable-line no-mixed-operators
				selectors.push( {
					file: name,
					selector: selectorName,
					a,
					b,
					c,
					sum,
				} );
			} );
		} );
	} );

	// Reverse sort to be highest -> lowest.
	selectors.sort( ( a, b ) => b.sum - a.sum );
	const selectorsByLength = [ ...selectors ].sort(
		( a, b ) => b.selector.length - a.selector.length
	);

	const selectorsWithIds = selectors.filter( ( { a } ) => a > 0 );

	return {
		audit: 'selectors',
		name: 'Selectors',
		results: [
			{
				id: 'count',
				label: 'Total number of selectors',
				value: selectors.length,
			},
			{
				id: 'count-with-ids',
				label: 'Number of selectors with IDs',
				value: selectorsWithIds.length,
			},
			{
				id: 'top-10-selectors',
				label: 'Top 10 selectors with the highest specificity',
				value: selectors.slice( 0, 10 ),
			},
			{
				id: 'bottom-10-selectors',
				label: 'Top 10 selectors by length',
				value: selectorsByLength.slice( 0, 10 ),
			},
		],
	};
};
