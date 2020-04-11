module.exports = function( values ) {
	const uniqueValues = [ ...new Set( values ) ];

	return uniqueValues
		.map( ( val ) => {
			// Count up how many times this item appears in the full list.
			const count = values.filter( ( c ) => c === val ).length;
			return {
				name: val,
				count,
			};
		} )
		.sort( ( a, b ) => {
			// Reverse sort
			return b.count - a.count;
		} );
};
