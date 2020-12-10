const path = require( 'path' );
const { runAudits } = require( '../run' );

describe( 'Run the audits', () => {
	it( 'runs with a configuration object', () => {

		// TODO: replace with cosmiconfig?
		const config = require( path.join( __dirname, '../utils/__tests__/fixtures/css-audit.config.js' ) );

		const result = runAudits( [
			{
				name: 'a.css',
				content: `body { font-size: 1em !important; line-height: 1.6; }`,
			},
		] );

		config.audits.forEach( ( audit ) => {
			if ( Array.isArray( audit ) ) {
				audit[ 1 ].split(',').forEach( ( property ) => {
					expect( result ).toContain( property );
				} );
			} else {
				expect( result ).toContain( audit );
			}
		} );
	} );
} );
