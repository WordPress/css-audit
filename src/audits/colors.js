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

	return {
		audit: 'colors',
		data: [
			{
				label: 'Number of unique colors',
				value: uniqColors.length,
			},
			{
				label: 'Number of unique colors (ignoring opacity)',
				value: uniqOpaqueColors.length,
			},
			{
				label: 'List of all colors',
				value: uniqColors,
			},
			{
				label: 'Top 10 most-used colors',
				value: colorsByCount.slice( 0, 10 ),
			},
			{
				label: 'Top 10 least-used colors',
				value: colorsByCount.slice( -10 ).reverse(),
			},
		],
	};
};
