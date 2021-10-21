const audit = require( '../audits/custom-properties' );

function getResultValue( results, key ) {
	const { value } = results.find( ( { id } ) => key === id );
	return value;
}

describe( 'Audit: Custom Properties', () => {
	it( 'should return no values when no custom properties', () => {
		const files = [
			{
				name: 'a.css',
				content: `body { font-size: 1em; line-height: 1.6; color: red }`,
			},
		];
		const { results } = audit( files );
		expect( getResultValue( results, 'unused' ) ).toHaveLength( 0 );
		expect( getResultValue( results, 'undefined' ) ).toHaveLength( 0 );
	} );

	it( 'should count the number of custom properties in a file', () => {
		const files = [
			{
				name: 'a.css',
				content: `:root { --foo: red; --bar: blue; }
					h1 { color: var(--foo); background: var(--baz); }
					h2 { color: var(--baz); background: var(--foo); }`,
			},
		];
		const { results } = audit( files );
		expect( getResultValue( results, 'unused' ) ).toHaveLength( 1 );
		expect( getResultValue( results, 'undefined' ) ).toHaveLength( 1 );
	} );

	it( 'should count custom properties used in other custom properties', () => {
		const files = [
			{
				name: 'a.css',
				content: `:root { --foo: red; --bar: 1px solid var(--foo); }
					h1 { border: var(--bar); }`,
			},
		];
		const { results } = audit( files );
		expect( getResultValue( results, 'unused' ) ).toHaveLength( 0 );
		expect( getResultValue( results, 'undefined' ) ).toHaveLength( 0 );
	} );

	it( 'should count the number of custom properties across multiple files', () => {
		const files = [
			{
				name: 'props.css',
				content: `:root { --foo: red; --bar: blue; }`,
			},
			{
				name: 'a.css',
				content: `h1 { color: var(--foo); }`,
			},
			{
				name: 'b.css',
				content: `h2 { color: rgb(var(--baz) / 0.5); background: var(--foo); }`,
			},
		];
		const { results } = audit( files );
		expect( getResultValue( results, 'unused' ) ).toHaveLength( 1 );
		expect( getResultValue( results, 'undefined' ) ).toHaveLength( 1 );
	} );
} );
