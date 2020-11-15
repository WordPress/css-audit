const fs = require( 'fs-extra' );
const path = require( 'path' );
const { TwingEnvironment, TwingLoaderFilesystem } = require( 'twing' );

/**
 * Internal dependencies
 */
const { getArgFromCLI } = require( '../utils/cli' );

const templatePath = path.join( __dirname, './templates' );

/**
 * Get the template file, falling back to report.twig if a custom file is not found.
 *
 * @param {string} name Name of the current report.
 * @return {string} File name.
 */
function getTemplateFile( name ) {
	if ( fs.existsSync( `${ templatePath }/${ name }.twig` ) ) {
		return `${ name }.twig`;
	}
	return 'report.twig';
}

module.exports = function ( reports ) {
	const loader = new TwingLoaderFilesystem( templatePath );
	const twing = new TwingEnvironment( loader, { debug: true } );

	const reportName = getArgFromCLI( '--filename' );
	const reportTemplate = getTemplateFile( reportName );
	const reportDest = path.join(
		__dirname,
		`../../public/${ reportName }.html`
	);

	const colorsData = reports.filter( ( { audit } ) => 'colors' === audit );
	const selectorsData = reports.filter(
		( { audit } ) => 'selectors' === audit
	);
	const importantData = reports.filter(
		( { audit } ) => 'important' === audit
	);
	const displayNoneData = reports.filter(
		( { audit } ) => 'display-none' === audit
	);

	const context = {
		colorsData,
		selectorsData,
		displayNoneData,
		importantData,
		title: `CSS Audit for ${ reportName }`,
	};

	twing
		.render( reportTemplate, context )
		.then( ( output ) => {
			console.log( `Generated template for ${ reportName }.` );
			fs.writeFileSync( reportDest, output );
		} )
		.catch( ( e ) => {
			console.error( e );
		} );
};
