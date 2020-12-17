const { cosmiconfigSync } = require( 'cosmiconfig' );
const { runAudits } = require( '../run' );

describe( 'Run the audits', () => {
	it( 'should output the JSON format from a configuration object', () => {
		const config = ( () => {

			const moduleName = 'test' === process.env ? 'test' : 'css-audit';

			try {
				const explorerSync = cosmiconfigSync( moduleName );
				const { config } = explorerSync.search();

				return config;
			} catch {
				console.error(
					"Can't find config file."
				);
			}
		} )();
		const result = runAudits( [
			{
				name: 'a.css',
				content: `body { font-size: 1em !important; line-height: 1.6; }`,
			},
		] );

		config.audits.forEach( ( audit ) => {
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
