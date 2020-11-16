/**
 * External dependencies
 */
const { parse } = require( 'postcss' );

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
		const root = parse( content, { from: name } );
		root.walkDecls( function ( { important, prop } ) {
			if ( important ) {
				count++;
				fileCount++;
				properties.push( prop );
			}
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

	return {
		audit: 'important',
		name: 'Important Overrides',
		results: [
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
		],
	};
};
