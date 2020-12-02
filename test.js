const config = {
	'single': 'value',
	'list': [
		'key1',
		[ 'key2', 'value in array' ],
		'key3'
	]
};

const getValue = ( term ) => {

	const configKeys = Object.keys( config );

	const checkTerm = ( list ) => {

		if ( 0 === list.length ) {
			return false;
		}

		const key = list[0];

		console.log('--',key, '--');

		if ( key === term ) {
			console.log( term, 'key is term ✅');
			return 'undefined' === typeof config[term] ? true : config[term];
		}
;
		console.log('term:', term, ' in config[key],', config[key].includes(term) );

		if ( config[key].includes(term) ) {

			console.log('in an array value');

			if ( term === config[key][0] ) {
				return true;
			}

			console.log( config[key][0] );
			return checkTerm( config[key][0] );
		}

		console.log('continue...');

		list.shift();

		console.log( list );



	};

	return checkTerm( configKeys );

};

// console.log( getValue( 'single' ) );
console.log( getValue( 'key2' ) );