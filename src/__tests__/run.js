const { runAudits } = require( '../run' );
const { getConfig } = require( '../utils/cli' );

describe( 'Run the audits', () => {
	it( 'should output the JSON format from a configuration object', () => {
		const configSrc = getConfig( process.env.NODE_ENV );

		const result = runAudits( [
			{
				name: 'a.css',
				content: `body { font-size: 1em !important; line-height: 1.6; }`,
			},
		] );

		configSrc.audits.forEach( ( audit ) => {
			if ( Array.isArray( audit ) ) {
				audit[ 1 ].split( ',' ).forEach( ( property ) => {
					expect( result ).toContain( property );
				} );
			} else {
				expect( result ).toContain( audit );
			}
		} );
	} );
} );
