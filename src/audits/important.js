const postcss = require( 'postcss' );

/**
 * Internal dependencies
 */
const getValuesCount = require( '../utils/get-values-count' );

module.exports = function( files = [] ) {
	let count = 0;
	const properties = [];

	files.forEach( ( { content } ) => {
		const ast = postcss.parse( content );
		ast.walkDecls( ( decl ) => {
			if ( decl.important ) {
				count++;
				properties.push( decl.prop );
			}
		} );
	} );

	const propertiesByCount = getValuesCount( properties );

	return [
		{
			label: 'Number of times `!important` is used',
			value: count,
		},
		{
			label: 'Top properties that use !important',
			value: propertiesByCount.slice( 0, 10 ),
		},
	];
};
