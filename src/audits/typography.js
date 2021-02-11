/**
 * Internal dependencies
 */
const propertyValues = require( './property-values' );

module.exports = function ( files = [] ) {
	const properties = [
		'font-size',
		'font-weight',
		'font-family',
		'line-height',
	];

	const results = properties.map( ( property ) => {
		return propertyValues( files, property ).results;
	} );

	return {
		audit: 'typography',
		name: `Typography`,
		results: results.flat(),
	};
};
