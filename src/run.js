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
	if ( !! getArg( '--property-values' ) ) {
		audits.push(
			require( './audits/property-values' )(
				cssFiles,
				getArg( '--property-values' ).split( ',' )
			)
		);
	}

	const reports = audits.flat().filter( Boolean );

	const format = getArg( '--format' );

	return formatReport( reports, format );
};

module.exports = {
	runAudits,
};
