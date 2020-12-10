const {
	getArg,
	getArgsFromCLI,
} = require( '../cli' );
const path = require( 'path' );

describe( 'Run Audits from CLI', () => {

	it( 'should get args from the CLI', () => {
		process.argv = [
			'',
			'',
			'--format=html',
			'--property-values=padding,padding-top',
			'--property-values=font-size,font-weight',
			'--media-queries',
		];

		expect( getArgsFromCLI() ).toEqual( [
			'--format=html',
			'--property-values=padding,padding-top',
			'--property-values=font-size,font-weight',
			'--media-queries',
		] );
	} );

	it( 'should return true for basic audit args in the CLI', () => {
		process.argv = [
			'',
			'',
			'--media-queries',
		];

		expect( getArg( '--media-queries' ) ).toBe( true );
	} );


	it( 'should return values for args that have them in the CLI', () => {
		process.argv = [
			'',
			'',
			'--property-values=padding,padding-top',
		];

		expect( getArg( '--property-values' ) ).toBe( 'padding,padding-top' );
	} );

} );

describe( 'Run Audits from Config', () => {
	beforeAll( () => {
		process.argv = [ '', '', '' ];
	});

	it.skip( 'should get args from config', () => {
		const config = {
			format: 'json',
			audits: [
				'media-queries',
				'important',
				['property-values', 'font-size,font-family']
				['property-values', 'margin,padding']
			]
		};

		// const expectedArgs =
	});

	it( 'should return the value for config keys', () => {
		expect( getArg( '--format' ) ).toBe( 'json' );
	});

	it( 'should return true if the arg is a item in the config audits array', () => {
		expect( getArg( '--important' ) ).toBe( true );
	} );

	it( 'should return an array of values for each property-value audits', () => {
		expect( getArg( '--property-values' ) ).toStrictEqual( ['font-size', 'padding-top,padding-bottom'] );
	} );

	it( 'should return false if arg is CLI only', () => {
		expect( getArg( '--help', true ) ).toBe( false );
	} );


	it( 'should return false if an arg does not exist in CLI or config', () => {
		process.argv = [
			'',
			'',
			'--media-queries',
		];

		expect( getArg( '--nonexistant' ) ).toBe( false );
	} );
} );
