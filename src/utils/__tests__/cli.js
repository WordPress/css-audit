const { getArgFromCLI, getArgsFromCLI } = require( '../cli' );
const path = require( 'path' );

const getArg = ( arg ) => {

	for ( const cliArg of getArgsFromCLI() ) {
		const [ name, value ] = cliArg.split( '=' );
		if ( name === arg ) {
			return 'undefined' === typeof value ? true : value || null;
		}
	}


	const config = require( path.join( process.cwd(), 'css-audit.config.js' ) );

	const getValue = ( term, key ) => {
		let value = config[key];

		console.log( term );

		if ( Array === typeof term ) {
			console.log( 'arry' );
			return value[1];
		}

		if ( term === key ) {
			return 'undefined' === typeof value ? true : value;
		}

		getValue( term, key );
	}

	for ( const key of Object.keys( config ) ) {
		const term = arg.slice(2);

		return getValue( term );
	}
};



describe( 'Get args', () => {

	it.only( 'should get the value for simple args and arrays', () => {

		const config = {
			'single': 'value',
			'list': [
				'key1',
				[ 'key2', 'value in array' ]
			]
		};

		const getValue = ( term ) => {

			const configKeys = Object.keys( config );

			const checkTerm = ( list ) => {

				if ( 0 === list.length ) {
					return false;
				}

				const key = list[0];

				if ( key === term ) {
					return 'undefined' === typeof config[term] ? true : config[term];
				}
		;
				if ( config[key].includes(term) ) {

					if ( term === config[key][0] ) {
						return true;
					}
					return 'object??';
				}

				list.shift();

				return checkTerm( list );


			};

			return checkTerm( configKeys );

		};

		expect( getValue( 'single' ) ).toBe( 'value' );
		expect( getValue( 'key1' ) ).toBe( true );
		expect( getValue( 'key2' ) ).toBe( 'value in array');

	});

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
		expect( getArg( '--property-values' ) ).toBe( 'padding-top,padding-bottom' );

	});

});
