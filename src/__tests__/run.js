const { cosmiconfigSync } = require( 'cosmiconfig' );
const { runAudits } = require( '../run' );

describe( 'Run the audits', () => {
	it( 'should output the JSON format from a configuration object', () => {
		const configSrc = ( () => {
			const moduleName = 'test';
			const explorerSync = cosmiconfigSync( moduleName );
			const { config } = explorerSync.search();

			try {
				return config;
			} catch ( e ) {
				console.error( e, "Can't find config file." );
			}
		} )();

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
