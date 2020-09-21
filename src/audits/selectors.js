const csstree = require( 'css-tree' );

function calculateSpecificty( [ a, b, c ], selector ) {
	if ( ! selector.type ) {
		return;
	}
	if ( 'lang' !== selector.name && selector.children ) {
		return selector.children
			.toArray()
			.reduce( calculateSpecificty, [ a, b, c ] );
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

module.exports = function ( files = [] ) {
	// let longest = 0;
	const selectors = [];

	files.forEach( ( { name, content } ) => {
		const ast = csstree.parse( content );
		csstree.walk( ast, {
			visit: 'Selector',
			enter( node ) {
				const selectorName = csstree.generate( node );
				const selectorList = node.children.toArray();
				const [ a, b, c ] = selectorList.reduce( calculateSpecificty, [
					0,
					0,
					0,
				] );
				const sum = 100 * a + 10 * b + c; // eslint-disable-line no-mixed-operators
				selectors.push( {
					file: name,
					selector: selectorName,
					a,
					b,
					c,
					sum,
				} );
			},
		} );
	} );

	// Reverse sort to be highest -> lowest.
	selectors.sort( ( a, b ) => b.sum - a.sum );
	const selectorsByLength = [ ...selectors ].sort(
		( a, b ) => b.selector.length - a.selector.length
	);

	const selectorsWithIds = selectors.filter( ( { a } ) => a > 0 );

	return [
		{
			// This is not totally accurate, since nested `:not` selectors and keyframes are also counted.
			label: 'Total number of selectors',
			value: selectors.length,
		},
		{
			label: 'Number of selectors with IDs',
			value: selectorsWithIds.length,
		},
		{
			label: 'Top 10 selectors with the highest specificity',
			value: selectors.slice( 0, 10 ),
		},
		{
			label: 'Top 10 selectors by length',
			value: selectorsByLength.slice( 0, 10 ),
		},
	];
};
