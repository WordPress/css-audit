const fs = require( 'fs-extra' );
const path = require( 'path' );
const Handlebars = require( 'handlebars' );

/**
 * Internal dependencies
 */
const { getArgFromCLI } = require( '../utils/cli' );

const getAuditPartial = ( audit ) => {
	return fs.readFileSync( path.join( __dirname, `./templates/audits/${name}.hbs` ) );
};

// TODO: read the audits/ directory for these
const audits = ( () => [
	'colors',
	'property-values',
	''
])();

audits.forEach( audit => {
	Handlebars.registerPartial( audit, getAuditPartial( audit ) );
})

module.exports = module.exports = function( reports ) {
	
	const reportName = getArgFromCLI('--report');
	const reportDest = path.join( __dirname, `../../public/${reportName}.html` );
	
	const templateSrc = ( ( name ) => {
		const templatePath = ( name ) => path.join( __dirname, `./templates/${name}.hbs` );
		const fileName = fs.existsSync( templatePath( name ) ) ? name : 'base';
		
		return fs.readFileSync( templatePath( fileName ) );
	} )( reportName );
	
	const reportTemplate = Handlebars.compile( templateSrc.toString() );
	const context = {
		title: `CSS Audit Report: ${reportName}`,
		reports,
		data: JSON.stringify( reports )
	};
	const html = reportTemplate( context );

	if ( undefined === typeof reportName ) {
		return 'You must provide a report name in the `--report=` CLI argument.';
	}

	// let content = '--- here is a report -- \n';
	// content += JSON.stringify(reports);
	
	fs.writeFileSync( reportDest, html );
};

