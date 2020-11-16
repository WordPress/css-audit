/**
 * External dependencies
 */
const { parse } = require( 'postcss' );
const { parse: parseValue } = require( 'postcss-values-parser' );
const tinycolor2 = require( 'tinycolor2' );

/**
 * Internal dependencies
 */
const getValuesCount = require( '../utils/get-values-count' );

module.exports = function ( files = [] ) {
	const colors = [];

	files.forEach( ( { content, name } ) => {
		const root = parse( content, { from: name } );
		root.walkDecls( function ( { value } ) {
			const valueRoot = parseValue( value );

			valueRoot.walkWords( ( node ) => {
				if ( node.isColor ) {
					colors.push( node.value );
				}
			} );

			valueRoot.walkFuncs( ( node ) => {
				if ( node.isColor ) {
					colors.push( node.toString() );
				}
			} );
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
		name: 'Colors',
		template: 'colors',
		results: [
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
		],
	};
};
