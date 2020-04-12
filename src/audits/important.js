const csstree = require( 'css-tree' );

/**
 * Internal dependencies
 */
const getValuesCount = require( '../utils/get-values-count' );

module.exports = function( files = [] ) {
	let count = 0;
	const properties = [];

	files.forEach( ( { content } ) => {
		const ast = csstree.parse( content );
		csstree.walk( ast, {
			visit: 'Declaration',
			enter( node ) {
				if ( node.important ) {
					count++;
					properties.push( node.property );
				}
			},
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
