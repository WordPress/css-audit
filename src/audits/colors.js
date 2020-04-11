const getColors = require( 'get-css-colors' );
const postcss = require( 'postcss' );
const tinycolor2 = require( 'tinycolor2' );

/**
 * Internal dependencies
 */
const getValuesCount = require( '../utils/get-values-count' );

module.exports = function( files = [] ) {
	const colors = [];

	files.forEach( ( { content } ) => {
		const ast = postcss.parse( content );
		ast.walkDecls( ( decl ) => {
			if ( decl.value ) {
				const hasColors = getColors( decl.value );
				if ( Array.isArray( hasColors ) ) {
					colors.push( ...hasColors );
				}
			}
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
	];
};
