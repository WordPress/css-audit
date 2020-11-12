const { runAudits } = require( '../run' );

describe( 'Run the audits', () => {
	it( 'runs with a configuration object', () => {
		const config = {
			format: 'json',
			audits: [
				'colors',
				'important',
				'display-none',
				'selectors',
				'media-queries',
				[ 'property-values', [ 'font-size' ] ],
				[
					'property-values',
					[
						'padding-top',
						'padding-bottom',
						'padding-left',
						'padding-right',
					],
				],
			],
		};
		const result = runAudits( config, [
			{
				name: 'a.css',
				content: `body { font-size: 1em !important; line-height: 1.6; }`,
			},
		] );

		config.audits.forEach( ( audit ) => {
			if ( Array.isArray( audit ) ) {
				audit[ 1 ].forEach( ( property ) => {
					expect( result ).toContain( property );
				} );
			} else {
				expect( result ).toContain( audit );
			}
		} );
	} );
} );
