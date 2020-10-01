const { getSpecificity } = require( '../get-specificity' );

describe( 'Calculate Specificity', () => {
	it( 'should calculate for element selectors', () => {
		expect( getSpecificity( 'body' ) ).toBe( 1 );
		expect( getSpecificity( 'body *' ) ).toBe( 1 );
		expect( getSpecificity( ':not(p)' ) ).toBe( 1 );
	} );

	it( 'should calculate for pseudo-elements', () => {
		expect( getSpecificity( 'p::first-line ' ) ).toBe( 2 );
	} );

	it( 'should calculate for pseudo-classes', () => {
		expect( getSpecificity( ':checked' ) ).toBe( 10 );
		expect( getSpecificity( 'a:link' ) ).toBe( 11 );
	} );

	it( 'should calculate for class selectors', () => {
		expect( getSpecificity( '.is-active' ) ).toBe( 10 );
	} );

	it( 'should calculate for attribute selectors', () => {
		expect( getSpecificity( '[type="radio"]' ) ).toBe( 10 );
	} );

	it( 'should calculate for id selectors', () => {
		expect( getSpecificity( '#unique' ) ).toBe( 100 );
	} );

	it( 'should calculate for combined selectors', () => {
		expect( getSpecificity( 'main p:first-child::first-line' ) ).toBe( 13 );
		expect( getSpecificity( '#unique > p' ) ).toBe( 101 );
		expect( getSpecificity( '.home .container:not(nav)' ) ).toBe( 21 );
		expect(
			getSpecificity( 'li > a[href*="en-US"] > .inline-warning' )
		).toBe( 22 );
	} );
} );
