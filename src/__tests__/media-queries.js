const audit = require( '../audits/media-queries' );

describe( 'Audit: Media Queries', () => {
	it( 'should return nothing when no media queries are used', () => {
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

	it( 'should count the number of media queries', () => {
		const files = [
			{
				name: 'a.css',
				content: `body { font-size: 1em; line-height: 1.6; }
				@media (max-width:30rem) { body { font-size: 2em; } }`,
			},
		];
		const { results } = audit( files );
		const { value } = results.find( ( { id } ) => 'count' === id );
		expect( value ).toBe( 1 );
	} );

	it( 'should count multiple media queries', () => {
		const files = [
			{
				name: 'a.css',
				content: `body { font-size: 1em; line-height: 1.6; }
				@media (max-width: 30rem) { body { font-size: 2em; } }
				@media screen and (max-width: 20rem) { body { font-size: 1.5em; } }
				@media (max-width: 20rem) { body { font-size: 1.5em; } }`,
			},
			{
				name: 'b.css',
				content: `body { font-size: 1em; line-height: 1.6; }
				@media (max-width: 15rem) { body { font-size: 2em; } }
				@media (max-width: 20rem) { body { font-size: 1.5em; } }`,
			},
		];
		const { results } = audit( files );
		const { value: count } = results.find( ( { id } ) => 'count' === id );
		expect( count ).toBe( 5 );
	} );

	it( 'should track different sizes in media queries', () => {
		const files = [
			{
				name: 'a.css',
				content: `body { font-size: 1em; line-height: 1.6; }
				@media (max-width: 30rem) { body { font-size: 2em; } }
				@media screen and (max-width: 20rem) { body { font-size: 1.5em; } }
				@media (max-width: 20rem) { body { font-size: 1.5em; } }`,
			},
			{
				name: 'b.css',
				content: `body { font-size: 1em; line-height: 1.6; }
				@media (max-width: 15rem) { body { font-size: 2em; } }
				@media (max-width: 20rem) { body { font-size: 1.5em; } }`,
			},
		];
		const { results } = audit( files );
		const { value: uniqueQueries } = results.find(
			( { id } ) => 'count-unique-queries' === id
		);
		expect( uniqueQueries ).toBe( 4 );

		const { value: topQueries } = results.find(
			( { id } ) => 'top-10-queries' === id
		);
		expect( topQueries[ 0 ].count ).toBe( 2 );
		expect( topQueries[ 0 ].name ).toBe( '(max-width:20rem)' );

		const { value: topSizes } = results.find(
			( { id } ) => 'top-10-sizes' === id
		);
		expect( topSizes[ 0 ].count ).toBe( 3 );
		expect( topSizes[ 0 ].name ).toBe( '20rem' );
	} );
} );
