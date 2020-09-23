const csstree = require( 'css-tree' );

/**
 * A recursive callback used to build up the specificity of a selector.
 *
 * This is intented to be used as a `reduce` callback, building up the
 * specificity in the array accumulator as it processes each part of a selector.
 *
 * @param {Array<number>} specificity The specificity as an array.
 * @param {string} selector A valid CSS selector.
 * @return {number} The calculated specificity value.
 */
function calculateSpecificity( [ a, b, c ], selector ) {
	if ( ! selector.type ) {
		return;
	}
	if ( 'lang' !== selector.name && selector.children ) {
		return selector.children
			.toArray()
			.reduce( calculateSpecificity, [ a, b, c ] );
	}

	switch ( selector.type ) {
		case 'IdSelector':
			a++;
			break;
		case 'ClassSelector':
		case 'AttributeSelector':
		case 'Nth':
			b++;
			break;
		case 'PseudoClassSelector':
			if ( 'not' === selector.name ) {
				break;
			}
			b++;
			break;
		case 'TypeSelector':
		case 'PseudoElementSelector':
			if ( '*' === selector.name ) {
				break;
			}
			c++;
			break;
		case 'WhiteSpace':
		case 'Combinator':
		case 'Identifier':
			// Whitespace, adjacent selectors (>, ~), … do not impact specificity.
			break;
		case 'Percentage':
			// Part of a keyframe, not to be calculated.
			break;
		default:
			console.warn( 'Unhandled selector type:', selector.type ); // eslint-disable-line no-console
	}
	return [ a, b, c ];
}

/**
 * Get the specificity value for a given CSS selector.
 *
 * @param {string} selector A valid CSS selector.
 * @return {number} The calculated specificity value.
 */
function getSpecificity( selector ) {
	const node = csstree.parse( selector, { context: 'selector' } );
	const selectorList = node.children.toArray();
	const [ a, b, c ] = selectorList.reduce( calculateSpecificity, [
		0,
		0,
		0,
	] );
	return 100 * a + 10 * b + c;
}

module.exports = {
	calculateSpecificity,
	getSpecificity,
};
