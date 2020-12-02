const { getArgFromCLI, getArgsFromCLI } = require( '../cli' );
const path = require( 'path' );

const getValue = ( config, term ) => {

	for (const key in config) {

		if ( config.hasOwnProperty(key) ) {

			if ( term === key ) {
				return 'undefined' === typeof config[term] ? true : config[term];
			}
		}

		if ( 'object' === typeof config[key] ) {
			return getValueFromList( config[key], term );
		}

	}
};

const getValueFromList = ( list, term ) => {

	if ( 0 === list.length ) {
		return false;
	}

	const currItem = list[0];

	if ( term === currItem ) {
		return true;
	}

	if ( term === currItem[0] ) {
		return currItem[1];
	}

	list.shift();

	return getValueFromList( list, term );

};

const getArg = ( arg ) => {

	const config = require( path.join( process.cwd(), 'css-audit.config.js' ) );

	for ( const cliArg of getArgsFromCLI() ) {

		const [ name, value ] = cliArg.split( '=' );

		if ( name === arg ) {
			return 'undefined' === typeof value ? true : value || null;
		}

	}

	const term = arg.substr(2);

	return getValue( config, term );

};

describe( 'Get args', () => {

	it( 'should get the value for simple args and arrays', () => {

		const config = {
			'single': 'value',
			'list': [
				'key1',
				[ 'key2', 'value in array' ]
			]
		};

		expect( getValue( config, 'single' ) ).toBe( 'value' );
		expect( getValue( config, 'key1' ) ).toBe( true );
		expect( getValue( config, 'key2' ) ).toBe( 'value in array');

	});

	it( 'should recursively get required values from an array values in the config', () => {

		const testList = [
			'key1',
			'key2',
			[ 'key3', 'value' ]
		];

		expect( getValueFromList( testList, 'key2' ) ).toBe( true );
		expect( getValueFromList( testList, 'key3' ) ).toBe( 'value' );
	})

	it( 'should get args from the CLI', () => {
		process.argv = [ '', '', '--format=html', '--property-values=padding,padding-top', '--media-queries' ];

		expect( getArgsFromCLI() ).toEqual(
			['--format=html', '--property-values=padding,padding-top', '--media-queries']
		);
	});

	it( 'should get an individual argument from CLI', () => {
		process.argv = [ '', '', '--media-queries', '--property-values=padding,padding-top' ];

		expect( getArg( '--media-queries' ) ).toBe( true );
		expect( getArg( '--property-values' ) ).toBe( 'padding,padding-top' );
	});

	it( 'should fallback to a config file if CLI arg is not available', () => {
		process.argv = [ '', '', '' ];
		process.cwd = () => path.join( __dirname, 'fixtures' );

		expect( getArg( '--format' ) ).toBe( 'json' );
		expect( getArg( '--media-queries' ) ).toBe( true );
		expect( getArg( '--property-values' ) ).toBe( 'font-size' );

	});

});
