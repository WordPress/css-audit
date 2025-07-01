const fs = require( 'node:fs' );
const path = require( 'path' );
const Twig = require( 'twig' );

/**
 * Internal dependencies
 */
const { getArg } = require( '../utils/cli' );

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
	const reportName = getArg( '--filename' );
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
	fs.copyFileSync( cssSrc, cssDest );

	Twig.renderFile(
		path.resolve( __dirname, 'html', reportTemplate ),
		context,
		( error, output ) => {
			if ( error ) {
				console.error( e );
			} else {
				console.log( `Generated template for ${ reportName }.` );
				fs.writeFileSync( reportDest, output );
			}
		}
	);
};
