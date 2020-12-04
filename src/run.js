/**
 * Internal dependencies
 */
const { formatReport } = require( './utils/format-report' );
const { getArg } = require( './utils/cli' );

const runAuditsFromCLIArgs = ( cssFiles ) => {
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

const runAuditsFromConfig = ( config, cssFiles ) => {
	const audits = [];
	const { format } = config;

	// TODO: Support value for config arg, and default to css-audit.config filename
	config.audits.forEach( ( audit ) => {
		if ( Array.isArray( audit ) ) {
			const [ auditName, auditTerms ] = audit;

			audits.push(
				require( `./audits/${ auditName }` )( cssFiles, auditTerms )
			);
		} else {
			audits.push( require( `./audits/${ audit }` )( cssFiles ) );
		}
	} );

	const reports = audits.flat().filter( Boolean );

	return formatReport( reports, format );
};

const runAudits = ( config = {}, cssFiles ) => {
	const result =
		0 < Object.keys( config ).length
			? runAuditsFromConfig( config, cssFiles )
			: runAuditsFromCLIArgs( cssFiles );

	return result;
};

module.exports = {
	runAudits,
};
