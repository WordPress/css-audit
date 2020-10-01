const csstree = require( 'css-tree' );
const getColors = require( 'get-css-colors' );
const tinycolor2 = require( 'tinycolor2' );

/**
 * Internal dependencies
 */
const getValuesCount = require( '../utils/get-values-count' );

module.exports = function ( files = [] ) {
	const colors = [];

	files.forEach( ( { content } ) => {
		const ast = csstree.parse( content );
		csstree.walk( ast, {
			visit: 'Value',
			enter( node ) {
				const nodeContent = csstree.generate( node );
				const hasColors = getColors( nodeContent );
				if ( Array.isArray( hasColors ) ) {
					colors.push( ...hasColors.map( ( i ) => i.toLowerCase() ) );
				}
			},
		} );
	} );

	const uniqColors = [ ...new Set( colors ) ];
	const colorsByCount = getValuesCount( colors );

	const uniqOpaqueColors = [
		...new Set(
			uniqColors.map( ( colorStr ) => {
				const color = tinycolor2( colorStr );
				return color.toHexString();
			} )
		),
	];

	return [
		{
			id: 'unique',
			label: 'Number of unique colors',
			value: uniqColors.length,
		},
		{
			id: 'unique-opaque',
			label: 'Number of unique colors (ignoring opacity)',
			value: uniqOpaqueColors.length,
		},
		{
			id: 'all-colors',
			label: 'List of all colors',
			value: uniqColors,
		},
		{
			id: 'top-10-colors',
			label: 'Top 10 most-used colors',
			value: colorsByCount.slice( 0, 10 ),
		},
		{
			id: 'bottom-10-colors',
			label: 'Top 10 least-used colors',
			value: colorsByCount.slice( -10 ).reverse(),
		},
	];
};
