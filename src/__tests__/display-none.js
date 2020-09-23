const audit = require( '../audits/display-none' );

describe( 'Audit: Display None', () => {
	it( 'should return nothing when display:none is not used', () => {
		const files = [
			{
				name: 'a.css',
				content: `body { font-size: 1em; line-height: 1.6; }`,
			},
		];
		const results = audit( files );
		const { value } = results.find( ( { id } ) => 'count' === id );
		expect( value ).toBe( 0 );
	} );

	it( 'should count the number of display:none in a file', () => {
		const files = [
			{
				name: 'a.css',
				content: `body { display: none; }`,
			},
		];
		const results = audit( files );
		const { value } = results.find( ( { id } ) => 'count' === id );
		expect( value ).toBe( 1 );
	} );

	it( 'should count the number of display:none in two files', () => {
		const files = [
			{
				name: 'a.css',
				content: `body { padding: 20px; display:none; }`,
			},
			{
				name: 'b.css',
				content: `body.hidden { display: none; }`,
			},
		];
		const results = audit( files );
		const { value: count } = results.find( ( { id } ) => 'count' === id );
		expect( count ).toBe( 2 );

		const { value: instances } = results.find(
			( { id } ) => 'instances' === id
		);
		expect( instances ).toEqual( [
			// Per line count looks for line breaks, so 1 is correct here.
			{ file: 'a.css', selector: 'body' },
			{ file: 'b.css', selector: 'body.hidden' },
		] );
	} );
} );
