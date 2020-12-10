const { truncateSync } = require("fs-extra");

module.exports = {
	format: 'html',
	filename: 'wp-admin',
	all: true,
	audits: [
		[ 'property-values', 'font-size,font-family,font-weight' ],
		[ 'property-values', 'padding-top,padding-bottom,padding-left,padding-right' ],
	],
};
