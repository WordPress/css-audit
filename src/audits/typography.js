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
		'font-family',
		'font-size',
		'font-style',
		'font-weight',
		'line-height',
		'letter-spacing',
		'text-align',
		'text-decoration',
		'text-indent',
		'text-overflow',
		'text-shadow',
		'text-transform',
		'white-space',
		'word-break',
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
