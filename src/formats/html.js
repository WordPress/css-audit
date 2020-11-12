const fs = require( 'fs-extra' );
const path = require( 'path' );
const { TwingEnvironment, TwingLoaderFilesystem } = require( 'twing' );

/**
 * Internal dependencies
 */
const { getArgFromCLI } = require( '../utils/cli' );

/**
 * Get the source of a template to compile.
 *
 * @param {string} name
 *
 * @return {string} Template contnet
 */
const getTemplateSrc = ( name ) => {
	const templatePath = ( tmplName ) =>
		path.join( __dirname, `./templates/${ tmplName }.twig` );

	// Allow a new base template that matches the report name.
	const fileName = fs.existsSync( templatePath( name ) ) ? name : 'report';

	return fileName + '.twig';
};

module.exports = function ( reports ) {
	const loader = new TwingLoaderFilesystem(
		path.join( __dirname, './templates' )
	);
	const twing = new TwingEnvironment( loader, { debug: true } );

	const reportName = getArgFromCLI( '--filename' );
	const reportTemplate = getTemplateSrc( reportName );
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
			console.log( `Generated template for ${ reportName }.` ); // eslint-disable-line no-console
			fs.writeFileSync( reportDest, output );
		} )
		.catch( ( e ) => {
			console.error( e ); // eslint-disable-line no-console
		} );
};
