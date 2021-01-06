module.exports = {
	format: 'html',
	filename: 'wp-admin',
	all: true,
	audits: [
		[ 'property-values', 'font-size,font-family,font-weight' ],
		[
			'property-values',
			'padding-top,padding-bottom,padding-left,padding-right',
		],
		[
			'property-values',
			'margin,margin-top,margin-bottom,margin-left,margin-right',
		],
		[ 'property-values', 'width,min-width,max-width' ],
		[ 'property-values', 'height,max-height,min-height' ],
		[ 'property-values', 'top', 'bottom', 'right', 'left' ][
			( 'property-values', 'z-index' )
		],
		[
			'property-values',
			'font-size,font,line-height,font-family,letter-spacing',
		],
		[
			'property-values',
			'background-position,background-size,border,border-radius,bottom,box-shadow,clip,font,font-size,height,left,line-height,letter-spacing,margin,max-height,max-width,min-height,min-width,outline,outline-offset,padding,right,text-indent,text-shadow,top,transform,width',
		],
	],
};
