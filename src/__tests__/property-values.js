const audit = require( '../audits/property-values' );

describe( 'Audit: Property Values', () => {
	it( 'should return nothing if no properties are set', () => {
		const files = [
			{
				name: 'a.css',
				content: `body { font-size: 1em; line-height: 1.6; }`,
			},
		];
		const results = audit( files );
		expect( results ).toHaveLength( 0 );
	} );

	it( 'should return nothing if the requested property is not used', () => {
		const files = [
			{
				name: 'a.css',
				content: `body { font-size: 1em; line-height: 1.6; }`,
			},
		];
		const results = audit( files, [ 'padding' ] );
		const { value } = results.find( ( { id } ) => 'count' === id );
		expect( value ).toBe( 0 );
	} );

	it( 'should count number of properties', () => {
		const files = [
			{
				name: 'a.css',
				content: `.box { padding: 10px; }
				.box-small { padding: 5px; }`,
			},
			{
				name: 'b.css',
				content: `.spacy-box { padding: 20px; }
				.spacy-box-small { padding: 10px; }`,
			},
		];
		const results = audit( files, [ 'padding' ] );
		const { value: count } = results.find( ( { id } ) => 'count' === id );
		expect( count ).toBe( 4 );

		const { value: unique } = results.find(
			( { id } ) => 'count-unique' === id
		);
		expect( unique ).toBe( 3 );

		const { value: topValues } = results.find(
			( { id } ) => 'top-10-values' === id
		);
		expect( topValues[ 0 ].count ).toBe( 2 );
		expect( topValues[ 0 ].name ).toBe( '10px' );
	} );
} );
