const { runAudits } = require( '../run' );

describe( 'Run the audits', () => {
	it( 'there will be tests', () => {
		const config = {
			"format": "json",
			"audits": [
				"colors",
				"important",
				"display-none",
				"selectors",
				"media-queries"
			]
		};
		const result = runAudits( config, [
			{
				name: 'a.css',
				content: `body { font-size: 1em !important; line-height: 1.6; }`,
			},
		] );

		config.audits.forEach( audit => {
			expect( result ).toContain( audit );
		});
	} );
} );
