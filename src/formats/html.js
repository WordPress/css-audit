const fs = require( 'fs-extra' );
const path = require( 'path' );
const { TwingEnvironment, TwingLoaderFilesystem } = require( 'twing' );

/**
 * Internal dependencies
 */
const { getArgFromCLI } = require( '../utils/cli' );

const templatePath = path.join( __dirname, './html/templates' );

/**
 * Get the template file, falling back to index.twig if a custom file is not found.
 *
 * @param {string} name Name of the current report.
 * @return {string} File name.
 */
function getTemplateFile( name ) {
	if ( fs.existsSync( `${ templatePath }/${ name }.twig` ) ) {
		return `${ name }.twig`;
	}
	return 'index.twig';
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

	const context = {
		title: `CSS Audit for ${ reportName }`,
		reports,
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
