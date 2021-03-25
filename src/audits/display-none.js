/**
 * External dependencies
 */
const { parse } = require( 'postcss' );

module.exports = function ( files = [] ) {
	const instances = [];

	files.forEach( ( { name, content } ) => {
		const root = parse( content, { from: name } );
		root.walkDecls( function ( { parent, prop, value } ) {
			if ( 'display' === prop ) {
				if ( 'none' === value ) {
					instances.push( {
						file: name,
						selector: parent.selector,
					} );
				}
			}
		} );
	} );

	return {
		audit: 'display-none',
		name: 'Display: None',
		results: [
			{
				id: 'count',
				label: 'Number of times `display: none` is used',
				value: instances.length,
			},
			{
				id: 'instances',
				label: 'Places where `display: none` is used',
				value: instances,
			},
		],
	};
};
