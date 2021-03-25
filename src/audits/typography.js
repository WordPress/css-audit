/**
 * Internal dependencies
 */
const propertyValues = require( './property-values' );

/**
 * Run the property values audit with specific properties
 * as a single audit.
 *
 * @param {array} files
 *
 * @returns Object containing audit data.
 */
module.exports = function ( files = [] ) {
	const properties = [
		'font-size',
		'font-weight',
		'font-family',
		'line-height',
		'letter-spacing',
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
