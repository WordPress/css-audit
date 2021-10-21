/**
 * External dependencies
 */
const { parse } = require( 'postcss' );
const { parse: parseValue } = require( 'postcss-values-parser' );

module.exports = function ( files = [] ) {
	const definedProps = [];
	const usedProps = [];
	files.forEach( ( { content, name } ) => {
		const root = parse( content, { from: name } );
		root.walkDecls( ( { prop, value } ) => {
			if ( prop ) {
				if ( '--' === prop.slice( 0, 2 ) ) {
					if ( ! definedProps.includes( prop ) ) {
						definedProps.push( prop );
					}
				}
				try {
					const valueRoot = parseValue( value, {
						ignoreUnknownWords: true,
					} );
					valueRoot.walkFuncs( ( node ) => {
						if ( node.isVar ) {
							if ( ! usedProps.includes( node.first.value ) ) {
								usedProps.push( node.first.value );
							}
						}
					} );
				} catch ( error ) {}
			}
		} );
	} );

	return {
		audit: 'custom-props',
		name: 'Custom Properties',
		results: [
			{
				id: 'unused',
				label: 'Defined but unused custom properties',
				value: definedProps
					.filter( ( x ) => ! usedProps.includes( x ) )
					.map( ( prop ) => ( { name: prop } ) ),
			},
			{
				id: 'undefined',
				label: 'Undefined custom properties',
				value: usedProps
					.filter( ( x ) => ! definedProps.includes( x ) )
					.map( ( prop ) => ( { name: prop } ) ),
			},
		],
	};
};
