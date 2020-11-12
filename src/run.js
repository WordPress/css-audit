/**
 * Internal dependencies
 */
const { formatReport } = require( './utils/format-report' );
const { getArgFromCLI } = require( './utils/cli' );

const runAuditsFromCLIArgs = ( cssFiles ) => {
	const audits = [];
	const runAll = getArgFromCLI( '--all' );
	const runRecommended = getArgFromCLI( '--recommended' );

	if ( runAll || runRecommended || getArgFromCLI( '--colors' ) ) {
		audits.push( require( './audits/colors' )( cssFiles ) );
	}
	if ( runAll || runRecommended || getArgFromCLI( '--important' ) ) {
		audits.push( require( './audits/important' )( cssFiles ) );
	}
	if ( runAll || getArgFromCLI( '--display-none' ) ) {
		audits.push( require( './audits/display-none' )( cssFiles ) );
	}
	if ( runAll || runRecommended || getArgFromCLI( '--selectors' ) ) {
		audits.push( require( './audits/selectors' )( cssFiles ) );
	}
	if ( runAll || runRecommended || getArgFromCLI( '--media-queries' ) ) {
		audits.push( require( './audits/media-queries' )( cssFiles ) );
	}
	if ( !! getArgFromCLI( '--property-values' ) ) {
		audits.push(
			require( './audits/property-values' )(
				cssFiles,
				getArgFromCLI( '--property-values' ).split( ',' )
			)
		);
	}

	const reports = audits.flat().filter( Boolean );

	const format = getArgFromCLI( '--format' );

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
