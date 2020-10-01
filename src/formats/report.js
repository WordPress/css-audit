const fs = require( 'fs-extra' );
const path = require( 'path' );
const {TwingEnvironment, TwingLoaderFilesystem} = require( 'twing' );

/**
 * Internal dependencies
 */
const { getArgFromCLI } = require( '../utils/cli' );

/**
 * Get the source of a template to compile.
 *
 * @param {string} subdir
 * @param {string} name
 *
 * @returns {string} Template contnet
 */
const getTemplateSrc = ( name ) => {
	const templatePath = ( name ) => path.join( __dirname, `./templates/${name}.twig` );
	const fileName = fs.existsSync( templatePath( name ) ) ? name : 'base';

	return fileName + '.twig';
};

let loader = new TwingLoaderFilesystem( path.join( __dirname, './templates' ) );
let twing = new TwingEnvironment( loader, { debug: true } );

module.exports = module.exports = function( reports ) {

	const reportName = getArgFromCLI('--report');
	const reportDest = path.join( __dirname, `../../public/${reportName}.html` );
	const reportTemplate = getTemplateSrc( reportName );
	const context = {
		reports,
		title: `CSS Audit for ${reportName}`
	};

	twing.render( reportTemplate, context ).then( ( output ) => {
		console.log( `Generated template for ${reportTemplate}.` );
		fs.writeFileSync( reportDest, output );
	}).catch( ( e ) => {
		console.error( e );
	});

};

