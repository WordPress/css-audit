const audit = require( '../audits/selectors' );

describe( 'Audit: Selectors', () => {
	it( 'should count the number of selectors used', () => {
		const files = [
			{
				name: 'a.css',
				content: `body { color: white; }
				p#test { color: white; }
				div { color: white; }
				.class { color: white; }`,
			},
		];
		const { results } = audit( files );
		const { value } = results.find( ( { id } ) => 'count' === id );
		expect( value ).toBe( 4 );
	} );

	it( 'should count the number of selectors that contain IDs', () => {
		const files = [
			{
				name: 'a.css',
				content: `body { color: white; }
				p#test { color: white; }
				div { color: white; }
				.class { color: white; }`,
			},
		];
		const { results } = audit( files );
		const { value } = results.find( ( { id } ) => 'count-with-ids' === id );
		expect( value ).toBe( 1 );
	} );

	it( 'should calculate and sort based on selector specificity', () => {
		const files = [
			{
				name: 'a.css',
				content: `body { color: white; }
				p#test { color: white; }
				div { color: white; }
				span, .class { color: white; }`,
			},
		];
		const { results } = audit( files );
		const { value } = results.find(
			( { id } ) => 'top-10-selectors' === id
		);
		expect( value[ 0 ].selector ).toBe( 'p#test' );
		expect( value[ 0 ].sum ).toBe( 101 );
		expect( value[ 1 ].selector ).toBe( '.class' );
		expect( value[ 1 ].sum ).toBe( 10 );
	} );

	it( 'should not double-count :not selectors', () => {
		const files = [
			{
				name: 'a.css',
				content: `body { color: white; }
				p:not(.class) { color: white; }`,
			},
		];
		const { results } = audit( files );
		const { value } = results.find( ( { id } ) => 'count' === id );
		expect( value ).toBe( 2 );
	} );
} );
