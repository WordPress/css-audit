const {
	getArg,
	getValueFromConfigList,
	getValueFromConfig,
	getArgsFromCLI,
} = require( '../cli' );
const path = require( 'path' );

describe( 'Get args', () => {

	it( 'should recursively get required values from an array values in the config', () => {
		const testList = [ 'key1', 'key2', [ 'key3', 'value' ] ];

		expect( getValueFromConfigList( testList, 'key2' ) ).toBe( true );
		expect( getValueFromConfigList( testList, 'key3' ) ).toBe( 'value' );
	} );

	it( 'should get args from the CLI', () => {
		process.argv = [
			'',
			'',
			'--format=html',
			'--property-values=padding,padding-top',
			'--media-queries',
		];

		expect( getArgsFromCLI() ).toEqual( [
			'--format=html',
			'--property-values=padding,padding-top',
			'--media-queries',
		] );
	} );

	it( 'should get an individual argument from CLI', () => {
		process.argv = [
			'',
			'',
			'--media-queries',
			'--property-values=padding,padding-top',
		];

		expect( getArg( '--media-queries' ) ).toBe( true );
		expect( getArg( '--property-values' ) ).toBe( 'padding,padding-top' );
	} );

	it( 'should return false if an arg does not exist in CLI or config', () => {
		process.argv = [
			'',
			'',
			'--media-queries',
		];

		expect( getArg( '--nonexistant' ) ).toBe( false );
	})

	it.only( 'should fallback to the config file if CLI arg is not available', () => {
		process.argv = [ '', '', '' ];

		// These values are in fixtures/css-audit.config.js
		expect( getArg( '--format' ) ).toBe( 'json' );
		expect( getArg( '--important' ) ).toBe( true );
		expect( getArg( '--media-queries' ) ).toBe( true );
		expect( getArg( '--property-values' ) ).toBe( 'font-size' );
	} );

	it( 'should return false if arg is CLI only', () => {
		process.argv = [ '', '', '' ];

		expect( getArg( '--help', true ) ).toBe( false );
	} );
} );
