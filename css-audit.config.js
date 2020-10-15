module.exports = {
	"format": "html",
	"filename": "wp-admin",
	"audits": [
		"colors",
		"important",
		"display-none",
		"selectors",
		"media-queries",
		[
			"property-values",
			{
				"options": [ "font-size" ]
			}
		],
		[
			"property-values",
			{
				"options": [
					"padding-top",
					"padding-bottom",
					"padding-left",
					"padding-right"
				]
			}
		]
	]
};
