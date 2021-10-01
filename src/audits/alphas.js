/**
 * External dependencies
 */
const { parse } = require( 'postcss' );
const { parse: parseValue } = require( 'postcss-values-parser' );

/**
 * Internal dependencies
 */
const getValuesCount = require( '../utils/get-values-count' );

module.exports = function ( files = [] ) {
	const alphas = [];
	const colors = [];

	files.forEach( ( { content, name } ) => {
		const root = parse( content, { from: name } );
		root.walkDecls( function ( { value } ) {
			try {
				const valueRoot = parseValue( value, {
					ignoreUnknownWords: true,
				} );

				valueRoot.walkFuncs( ( node ) => {
					if ( node.isColor && node.nodes.length ) {
						const values = node.nodes
							.filter( ( n ) => 'numeric' === n.type )
							.map( ( n ) => Number( n.value ) );
						if ( values.length === 4 ) {
							alphas.push( values[ 3 ] );
							colors.push( node.toString() );
						}
					}
				} );
			} catch ( error ) {}
		} );
	} );

	const uniqAlphas = [ ...new Set( alphas ) ];
	const alphasByCount = getValuesCount( alphas );
	const uniqColors = [ ...new Set( colors ) ];

	return {
		audit: 'alphas',
		name: 'Opacities',
		template: 'alpha',
		results: [
			{
				id: 'unique',
				label: 'Number of unique alphas',
				value: uniqAlphas.length,
			},
			{
				id: 'unique-colors',
				label: 'Number of colors with opacity',
				value: uniqColors.length,
			},
			{
				id: 'all-alphas',
				label: 'List of all alphas',
				value: alphasByCount,
			},
			{
				id: 'all-colors',
				label: 'List of all colors with opacity',
				value: uniqColors.sort(),
			},
		],
	};
};
