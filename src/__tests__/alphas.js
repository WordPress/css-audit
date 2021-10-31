const audit = require( '../audits/alphas' );

function getResultValue( results, key ) {
	const { value } = results.find( ( { id } ) => key === id );
	return value;
}

describe( 'Audit: Alphas', () => {
	it( 'should return no values when no transparent colors are used', () => {
		const files = [
			{
				name: 'a.css',
				content: `body { font-size: 1em; line-height: 1.6; color: red }`,
			},
		];
		const { results } = audit( files );
		expect( getResultValue( results, 'unique' ) ).toBe( 0 );
	} );

	it( 'should count the number of alpha values in a file', () => {
		const files = [
			{
				name: 'a.css',
				content: `body { color: rgba(0, 0, 0, 0.3); }`,
			},
		];
		const { results } = audit( files );
		expect( getResultValue( results, 'unique' ) ).toBe( 1 );
	} );

	it( 'should find values across rulesets', () => {
		const files = [
			{
				name: 'a.css',
				content: `h1 { color: rgba(52, 0, 182, 0.95); }
				h2 { color: rgba(206, 234, 196, .95); }
				h3 { color: rgba( 119, 255, 214, 0.125); }
				h4 { color: rgba(201, 15, 59, .875); }
				h4 { color: rgba(0, 0, 0, 1); }`,
			},
		];
		const { results } = audit( files );
		expect( getResultValue( results, 'unique' ) ).toBe( 4 );
		expect( getResultValue( results, 'unique-colors' ) ).toBe( 5 );
		expect( getResultValue( results, 'all-alphas' ) ).toEqual( [
			{
				count: 2,
				name: 0.95,
			},
			{
				count: 1,
				name: 0.125,
			},
			{
				count: 1,
				name: 0.875,
			},
			{
				count: 1,
				name: 1,
			},
		] );
		expect( getResultValue( results, 'all-colors' ) ).toEqual( [
			'rgba( 119, 255, 214, 0.125)',
			'rgba(0, 0, 0, 1)',
			'rgba(201, 15, 59, .875)',
			'rgba(206, 234, 196, .95)',
			'rgba(52, 0, 182, 0.95)',
		] );
	} );

	it( 'should find values in all color functions', () => {
		const files = [
			{
				name: 'a.css',
				content: `h1 { color: hsla(95, 55%, 46%, 0.9); }
				h2 { color: hsl(290, 72%, 24%, .333); }
				h3 { color: rgb(41, 194, 191, 1); }
				h4 { color: hsl(198 92 20 / 0.5); }
				h5 { color: rgb(13 1 26 / 0.05); }`,
			},
		];
		const { results } = audit( files );
		expect( getResultValue( results, 'unique' ) ).toBe( 5 );
		expect( getResultValue( results, 'unique-colors' ) ).toBe( 5 );
		expect( getResultValue( results, 'all-alphas' ) ).toEqual( [
			{
				count: 1,
				name: 0.9,
			},
			{
				count: 1,
				name: 0.333,
			},
			{
				count: 1,
				name: 1,
			},
			{
				count: 1,
				name: 0.5,
			},
			{
				count: 1,
				name: 0.05,
			},
		] );
		expect( getResultValue( results, 'all-colors' ) ).toEqual( [
			'hsl(198 92 20 / 0.5)',
			'hsl(290, 72%, 24%, .333)',
			'hsla(95, 55%, 46%, 0.9)',
			'rgb(13 1 26 / 0.05)',
			'rgb(41, 194, 191, 1)',
		] );
	} );

	it( 'should count alphas in shorthand properties', () => {
		const files = [
			{
				name: 'a.css',
				content: `body { border: 3px solid rgba(0, 0, 0, 0.5); }`,
			},
		];
		const { results } = audit( files );
		const { value } = results.find( ( { id } ) => 'unique' === id );
		expect( value ).toBe( 1 );
	} );
} );
