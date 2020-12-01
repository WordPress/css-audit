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

	// Allow a new base template that matches the report name.
	const fileName = fs.existsSync( templatePath( name ) ) ? name : 'report';

	return fileName + '.twig';
};

module.exports = function ( reports ) {

	const loader = new TwingLoaderFilesystem( path.join( __dirname, './templates' ) );
	const twing = new TwingEnvironment( loader, { debug: true } );

	const reportName = getArgFromCLI( '--filename' );
	const reportTemplate = getTemplateSrc( reportName );
	const reportDest = path.join(
		__dirname,
		`../../public/${ reportName }.html`
	);

	const colorsData = reports.filter( ( { audit } ) => 'colors' === audit );
	const selectorsData = reports.filter( ( { audit } ) => 'selectors' === audit );
	const importantData = reports.filter( ( { audit } ) => 'important' === audit );
	const displayNoneData = reports.filter( ( { audit } ) => 'display-none' === audit );

   // Create array of audit IDs for jump menu
   const idsForNav = [];
   if( colorsData.length ) idsForNav.push( "colors" );
   if( selectorsData.length ) idsForNav.push( "selectors" );
   if( importantData.length ) idsForNav.push( "important" );
   if( displayNoneData.length ) idsForNav.push( "display-none" );

	const context = {
      idsForNav,
		colorsData,
		displayNoneData,
		importantData,
		selectorsData,
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
