const audit = require( '../audits/colors' );

describe( 'Audit: Colors', () => {
	it( 'should return no colors when no colors are used', () => {
		const files = [
			{
				name: 'a.css',
				content: `body { font-size: 1em; line-height: 1.6; }`,
			},
		];
		const results = audit( files );
		const { value } = results.find( ( { id } ) => 'unique' === id );
		expect( value ).toBe( 0 );
	} );

	it.skip( 'should ignore colors in non-color properties', () => {
		const files = [
			{
				name: 'a.css',
				content: `body { background-image: url('logo-white.png'); }`,
			},
		];
		const results = audit( files );
		const { value } = results.find( ( { id } ) => 'unique' === id );
		expect( value ).toBe( 0 );
	} );

	it( 'should count the number of colors in a file', () => {
		const files = [
			{
				name: 'a.css',
				content: `body { color: #0ff; }`,
			},
		];
		const results = audit( files );
		const { value } = results.find( ( { id } ) => 'unique' === id );
		expect( value ).toBe( 1 );
	} );

	it( 'should count the number of colors in two files', () => {
		const files = [
			{
				name: 'a.css',
				content: `body { color: #0ff; }`,
			},
			{
				name: 'b.css',
				content: `body { color: #f00; }`,
			},
		];
		const results = audit( files );
		const { value } = results.find( ( { id } ) => 'unique' === id );
		expect( value ).toBe( 2 );
	} );

	it( 'should sort the most used colors', () => {
		const files = [
			{
				name: 'a.css',
				content: `h1 { color: red; }
				h2 { color: pink; }
				h3 { color: pink; }
				h4 { color: blue; }
				h5 { color: cyan; }
				h6 { color: lightgreen; }`,
			},
		];
		const results = audit( files );
		const { value } = results.find( ( { id } ) => 'top-10-colors' === id );
		expect( value[ 0 ].name ).toBe( 'pink' );
	} );

	it( 'should sort the least used colors', () => {
		const files = [
			{
				name: 'a.css',
				content: `h1 { color: red; }
				h2 { color: pink; }
				h3 { color: red; }
				h4 { color: blue; }
				h5 { color: blue; }
				h6 { color: red; }`,
			},
		];
		const results = audit( files );
		const { value } = results.find(
			( { id } ) => 'bottom-10-colors' === id
		);
		expect( value[ 0 ].name ).toBe( 'pink' );
	} );
} );
