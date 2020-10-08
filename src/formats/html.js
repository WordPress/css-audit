const fs = require( 'fs-extra' );
const path = require( 'path' );
const { exit } = require('process');
const { TwingEnvironment, TwingLoaderFilesystem } = require( 'twing' );

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
	const templatePath = ( name ) =>
		path.join( __dirname, `./templates/${ name }.twig` );
	const fileName = fs.existsSync( templatePath( name ) ) ? name : 'base';

	return fileName + '.twig';
};

module.exports = function ( reports ) {

	const loader = new TwingLoaderFilesystem( path.join( __dirname, './templates' ) );
	const twing = new TwingEnvironment( loader, { debug: true } );

	const reportName = getArgFromCLI( '--report' );
	const reportTemplate = getTemplateSrc( reportName );
	const reportDest = path.join(
		__dirname,
		`../../public/${ reportName }.html`
	);

	const colorsData = reports.filter( ( { audit } ) => 'colors' === audit );
	const selectorsData = reports.filter( ( { audit } ) => 'selectors' === audit );
	const importantData = reports.filter( ( { audit } ) => 'important' === audit );
	const displayNoneData = reports.filter( ( { audit } ) => 'display-none' === audit );

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
			console.log( `Generated template for ${ reportTemplate }.` );
			fs.writeFileSync( reportDest, output );
		} )
		.catch( ( e ) => {
			console.error( e );
		} );
};
