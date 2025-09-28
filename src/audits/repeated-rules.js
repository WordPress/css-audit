module.exports = {
	name: "repeated-rules",
	description: "Detect repeated CSS property/value pairs across selectors",

	run: (astRoot, result) => {
		const seen = new Map();
		const repeated = [];

		// Walk through all rules in the CSS AST
		astRoot.walkDecls((decl) => {
			const rule = `${decl.prop}: ${decl.value}`;
			if (seen.has(rule)) {
				repeated.push(rule);
			} else {
				seen.set(rule, decl.parent.selector);
			}
		});

		if (repeated.length > 0) {
			result.warn(
				`Repeated rules found: ${[...new Set(repeated)].join(", ")}`
			);
		}
	},
};
