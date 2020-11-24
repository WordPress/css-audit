module.exports = {
	format: 'json',
	audits: [
		'colors',
		'important',
		'display-none',
		'selectors',
		'media-queries',
		[ 'property-values', 'font-size' ],
		[ 'property-values', 'padding-top,padding-bottom' ],
	],
};