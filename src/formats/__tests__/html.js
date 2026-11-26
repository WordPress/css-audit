const fs = require( 'node:fs' );
const path = require( 'path' );
const Twig = require( 'twig' );

jest.mock( '../../utils/cli', () => ( {
	getArg: jest.fn(),
} ) );

/**
 * Internal dependencies
 */
const { getArg } = require( '../../utils/cli' );
const formatHtml = require( '../html' );

describe( 'Format: HTML', () => {
	afterEach( () => {
		jest.restoreAllMocks();
		getArg.mockReset();
	} );

	it( 'should log the Twig error instead of throwing when rendering fails', () => {
		const renderError = new Error( 'Template parse error' );
		getArg.mockReturnValue( 'wp-admin' );
		jest.spyOn( fs, 'existsSync' ).mockReturnValue( false );
		jest.spyOn( fs, 'copyFileSync' ).mockImplementation( () => {} );
		const writeSpy = jest
			.spyOn( fs, 'writeFileSync' )
			.mockImplementation( () => {} );
		const errorSpy = jest
			.spyOn( console, 'error' )
			.mockImplementation( () => {} );
		const logSpy = jest
			.spyOn( console, 'log' )
			.mockImplementation( () => {} );
		jest.spyOn( Twig, 'renderFile' ).mockImplementation(
			( _template, _context, callback ) => {
				callback( renderError );
			}
		);

		expect( () => formatHtml( [] ) ).not.toThrow();
		expect( errorSpy ).toHaveBeenCalledWith( renderError );
		expect( writeSpy ).not.toHaveBeenCalled();
		expect( logSpy ).not.toHaveBeenCalled();
	} );

	it( 'should fall back to index.twig and write rendered HTML to public', () => {
		const reports = [ { audit: 'colors', name: 'Colors', results: [] } ];
		getArg.mockReturnValue( 'wp-admin' );
		jest.spyOn( fs, 'existsSync' ).mockReturnValue( false );
		const copySpy = jest
			.spyOn( fs, 'copyFileSync' )
			.mockImplementation( () => {} );
		const writeSpy = jest
			.spyOn( fs, 'writeFileSync' )
			.mockImplementation( () => {} );
		const logSpy = jest
			.spyOn( console, 'log' )
			.mockImplementation( () => {} );
		const renderSpy = jest
			.spyOn( Twig, 'renderFile' )
			.mockImplementation( ( _template, _context, callback ) => {
				callback( null, '<html>ok</html>' );
			} );

		formatHtml( reports );

		const htmlDir = path.resolve( __dirname, '..', 'html' );
		const publicDir = path.resolve( __dirname, '..', '..', '..', 'public' );

		expect( copySpy ).toHaveBeenCalledWith(
			path.join( htmlDir, 'style.css' ),
			path.join( publicDir, 'style.css' )
		);
		expect( renderSpy ).toHaveBeenCalledWith(
			path.join( htmlDir, 'index.twig' ),
			{
				title: 'CSS Audit for wp-admin',
				reports,
			},
			expect.any( Function )
		);
		expect( logSpy ).toHaveBeenCalledWith(
			'Generated template for wp-admin.'
		);
		expect( writeSpy ).toHaveBeenCalledWith(
			path.join( publicDir, 'wp-admin.html' ),
			'<html>ok</html>'
		);
	} );

	it( 'should use a custom twig template matching the filename when present', () => {
		getArg.mockReturnValue( 'custom-report' );
		jest.spyOn( fs, 'existsSync' ).mockReturnValue( true );
		jest.spyOn( fs, 'copyFileSync' ).mockImplementation( () => {} );
		jest.spyOn( fs, 'writeFileSync' ).mockImplementation( () => {} );
		jest.spyOn( console, 'log' ).mockImplementation( () => {} );
		const renderSpy = jest
			.spyOn( Twig, 'renderFile' )
			.mockImplementation( ( _template, _context, callback ) => {
				callback( null, '<html>custom</html>' );
			} );

		formatHtml( [] );

		const htmlDir = path.resolve( __dirname, '..', 'html' );
		expect( renderSpy ).toHaveBeenCalledWith(
			path.join( htmlDir, 'custom-report.twig' ),
			{
				title: 'CSS Audit for custom-report',
				reports: [],
			},
			expect.any( Function )
		);
	} );
} );
