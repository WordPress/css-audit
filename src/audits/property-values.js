const postcss = require( 'postcss' );

/**
 * Internal dependencies
 */
const getValuesCount = require( '../utils/get-values-count' );

module.exports = function( files = [], properties ) {
	const values = [];
	if ( ! Array.isArray( properties ) ) {
		properties = Array( properties );
	}
	// Skip out if no properties are passed in.
	if ( ! properties.length ) {
		return [];
	}

	files.forEach( ( { content } ) => {
		const ast = postcss.parse( content );
		ast.walkDecls( ( decl ) => {
			if ( -1 !== properties.indexOf( decl.prop ) && decl.value ) {
				values.push( decl.value );
			}
		} );
	} );

	const uniqueValues = [ ...new Set( values ) ];
	const valuesByCount = getValuesCount( values );

	return [
		{
			label: `Number of unique values for ${ properties.join( ', ' ) }`,
			value: uniqueValues.length,
		},
		{
			label: `Top 10 most-used values for ${ properties.join( ', ' ) }`,
			value: valuesByCount.slice( 0, 10 ),
		},
		{
			label: `Top 10 least-used values for ${ properties.join( ', ' ) }`,
			value: valuesByCount.slice( -10 ).reverse(),
		},
	];
};
