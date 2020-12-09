const csstree = require( 'css-tree' );

module.exports = function ( files = [] ) {
	const instances = [];

	files.forEach( ( { name, content } ) => {
		const ast = csstree.parse( content );
		csstree.walk( ast, {
			visit: 'Rule',
			enter( node ) {
				const selector = csstree.generate( node.prelude );
				csstree.walk( node.block, {
					visit: 'Declaration',
					enter( childNode ) {
						if ( 'display' === childNode.property ) {
							const value = csstree.generate( childNode.value );
							if ( 'none' === value ) {
								instances.push( {
									file: name,
									selector,
								} );
							}
						}
					},
				} );
			},
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
