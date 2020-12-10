/**
 * Internal dependencies
 */
const { formatReport } = require( './utils/format-report' );
const { getArg } = require( './utils/cli' );

const runAudits = ( cssFiles ) => {
	const audits = [];
	const runAll = getArg( '--all' );
	const runRecommended = getArg( '--recommended' );

	if ( runAll || runRecommended || getArg( '--colors' ) ) {
		audits.push( require( './audits/colors' )( cssFiles ) );
	}
	if ( runAll || runRecommended || getArg( '--important' ) ) {
		audits.push( require( './audits/important' )( cssFiles ) );
	}
	if ( runAll || getArg( '--display-none' ) ) {
		audits.push( require( './audits/display-none' )( cssFiles ) );
	}
	if ( runAll || runRecommended || getArg( '--selectors' ) ) {
		audits.push( require( './audits/selectors' )( cssFiles ) );
	}
	if ( runAll || runRecommended || getArg( '--media-queries' ) ) {
		audits.push( require( './audits/media-queries' )( cssFiles ) );
	}

	const propertyValues = getArg( '--property-values' );

	// Multiple property value arguments are only supported in config.
	if ( Array.isArray( propertyValues ) && propertyValues.length ) {
		propertyValues.forEach( ( values ) => {
			audits.push(
				require( './audits/property-values' )(
					cssFiles,
					values.split( ',' )
				)
			);
		} );
	} else {
		audits.push(
			require( './audits/property-values' )(
				cssFiles,
				propertyValues.split( ',' )
			)
		);
	}

	const reports = audits.flat().filter( Boolean );

	const format = getArg( '--format' );

	if ( 'html' === format && ! getArg( '--filename' ) ) {
		console.error(
			'Could not run audits. \nAn argument for filename must be provided for the HTML format.'
		);
		return;
	}

	return formatReport( reports, format );
};

module.exports = {
	runAudits,
};
