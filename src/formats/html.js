const fs = require( 'fs-extra' );
const path = require( 'path' );
const { TwingEnvironment, TwingLoaderFilesystem } = require( 'twing' );

/**
 * Internal dependencies
 */
const { getArgFromCLI } = require( '../utils/cli' );

const templatePath = path.join( __dirname, './html' );

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
	const reportDestDir = path.join( __dirname, '..', '..', 'public' );
	const reportDest = path.join( reportDestDir, `${ reportName }.html` );
	const context = {
		title: `CSS Audit for ${ reportName }`,
		reports,
	};

	// Copy CSS src to /public
	const cssSrc = path.join( __dirname, 'html', 'style.css' );
	const cssDest = path.join( reportDestDir, 'style.css' );
	fs.copyFile( cssSrc, cssDest );

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
