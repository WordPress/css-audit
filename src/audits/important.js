const csstree = require( 'css-tree' );

/**
 * Internal dependencies
 */
const getValuesCount = require( '../utils/get-values-count' );

module.exports = function ( files = [] ) {
	let count = 0;
	const properties = [];
	const fileInstances = [];

	files.forEach( ( { name, content } ) => {
		let fileCount = 0;
		const ast = csstree.parse( content );
		csstree.walk( ast, {
			visit: 'Declaration',
			enter( node ) {
				if ( node.important ) {
					count++;
					fileCount++;
					properties.push( node.property );
				}
			},
		} );
		fileInstances.push( {
			name,
			count: fileCount,
			// Get a ratio of !important per line.
			perLine: fileCount / content.split( '\n' ).length,
		} );
	} );

	const propertiesByCount = getValuesCount( properties );
	const instancesPerFile = fileInstances
		.filter( ( row ) => row.count > 0 )
		.sort( ( a, b ) => b.count - a.count );

	return [
		{
			id: 'count',
			label: 'Number of times `!important` is used',
			value: count,
		},
		{
			id: 'count-per-file',
			label: 'Number of times `!important` is used per file',
			value: instancesPerFile,
		},
		{
			id: 'top-10-properties',
			label: 'Top properties that use !important',
			value: propertiesByCount.slice( 0, 10 ),
		},
	];
};
