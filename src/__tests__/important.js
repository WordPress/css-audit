const audit = require( '../audits/important' );

describe( 'Audit: Important', () => {
	it( 'should return nothing when important is not used', () => {
		const files = [
			{
				name: 'a.css',
				content: `body { font-size: 1em; line-height: 1.6; }`,
			},
		];
		const { results } = audit( files );
		const { value } = results.find( ( { id } ) => 'count' === id );
		expect( value ).toBe( 0 );
	} );

	it( 'should ignore the word important in values', () => {
		const files = [
			{
				name: 'a.css',
				content: `body { background-image: url('important-logo.png'); }`,
			},
		];
		const { results } = audit( files );
		const { value } = results.find( ( { id } ) => 'count' === id );
		expect( value ).toBe( 0 );
	} );

	it( 'should count the number of !important in a file', () => {
		const files = [
			{
				name: 'a.css',
				content: `body { color: #0ff !important; }`,
			},
		];
		const { results } = audit( files );
		const { value } = results.find( ( { id } ) => 'count' === id );
		expect( value ).toBe( 1 );
	} );

	it( 'should count the number of !important in two files', () => {
		const files = [
			{
				name: 'a.css',
				content: `body { padding: 20px; margin-bottom: 10px !important; }`,
			},
			{
				name: 'b.css',
				content: `body { color: red !important; }`,
			},
		];
		const { results } = audit( files );
		const { value: count } = results.find( ( { id } ) => 'count' === id );
		expect( count ).toBe( 2 );

		const { value: countFile } = results.find(
			( { id } ) => 'count-per-file' === id
		);
		expect( countFile ).toEqual( [
			// Per line count looks for line breaks, so 1 is correct here.
			{ name: 'a.css', count: 1, perLine: 1 },
			{ name: 'b.css', count: 1, perLine: 1 },
		] );
	} );

	it( 'should sort the properties that most use !important', () => {
		const files = [
			{
				name: 'a.css',
				content: `
				h1 {
					font-size: 2em !important;
					letter-spacing: 1px;
					text-transform: uppercase !important;
				}
				h2 {
					font-size: 2em !important;
					letter-spacing: 1px;
					text-transform: uppercase;
				}`,
			},
		];
		const { results } = audit( files );
		const { value } = results.find(
			( { id } ) => 'top-10-properties' === id
		);
		expect( value[ 0 ].name ).toBe( 'font-size' );
	} );
} );
