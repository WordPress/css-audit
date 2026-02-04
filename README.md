# CSS Audit

An automated auditing tool specifically designed for **WordPress Core CSS**. It tracks design consistency, code quality, and performance metrics across `wp-admin` and `wp-includes`, helping the Core CSS team, designers, and contributors manage technical debt.

This tool powers the [daily automated audit report](https://wordpress.github.io/css-audit/public/wp-admin) for `wp-admin`, which runs against the latest code in `trunk` from [WordPress/wordpress-develop](https://github.com/WordPress/wordpress-develop/).

## 🎯 Purpose
WordPress has a large and long-lived CSS codebase that has evolved over nearly two decades. This tool helps to support:

*   **Tracking CSS Evolution**: Monitoring how WordPress Core CSS metrics change between versions.
*   **Managing Regressions**: Identifying potential spikes in `!important` usage, color definition proliferation, or selector specificity in `wp-admin` and `wp-includes`.
*   **Design Consistency**: Promoting visual cohesion in the admin interface as new features are added.
*   **Performance & Health**: Highlighting hidden styles (`display: none`), excessive selector nesting, and opportunities to refactor legacy CSS.

## 👥 Who This Tool Is For

*   **WordPress Core Contributors**: To check if new CSS changes introduce regressions or unnecessary complexity.
*   **Design & Accessibility Teams**: To evaluate the usage of colors, font sizes, and layout properties, which supports evaluation related to accessibility and the WordPress Design System.
*   **Release Leads**: To review CSS statistics.


## 🛠️ Installation

To run the audits locally, clone this repository and install dependencies. You will need [Node.js](https://nodejs.org/en/) and `npm`.

```bash
git clone git@github.com:wordpress/css-audit.git
cd css-audit
npm install
```

## 📥 Fetching WordPress Core CSS

Before running an audit, you need CSS files to analyze. You can download these directly from the official WordPress Subversion (SVN) repository.

### Option A: Audit a Specific Version (e.g., WordPress 6.4)
Use this to audit a released version or specific branch.

```bash
mkdir wp-6.4
# Download wp-admin CSS
svn export https://develop.svn.wordpress.org/branches/6.4/src/wp-admin/css --depth files wp-6.4/admin
# Download wp-includes CSS
svn export https://develop.svn.wordpress.org/branches/6.4/src/wp-includes/css --depth files wp-6.4/includes
```

### Option B: Audit `trunk` (Development)
Use this to audit the latest code currently in development.

```bash
mkdir trunk
# Download wp-admin CSS from trunk
svn export https://develop.svn.wordpress.org/trunk/src/wp-admin/css --depth files trunk/admin
# Download wp-includes CSS from trunk
svn export https://develop.svn.wordpress.org/trunk/src/wp-includes/css --depth files trunk/includes
```

> **Note:** WordPress splits CSS into `wp-admin` (Dashboard, editor) and `wp-includes` (frontend blocks, admin bar). We recommend downloading both for a complete audit.

## 🚀 Running Audits

Once you have the CSS files, you can run the audit tool.

```bash
# General usage
npm run css-audit -- <path-to-css-files> [options]

# Example: Audit the downloaded 6.4 files
npm run css-audit -- wp-6.4/**/* --recommended
```

### Options

```
--colors          Run colors audit.
--important       Run !important audit.
--display-none    Run display: none audit.
--selectors       Run selectors audit.
--media-queries   Run media queries audit.
--property-values Run audit for a given set of property values, comma-separated.
--recommended     Run recommended audits (colors, important, selectors). Default: true.
--all             Run all audits (except property values).
--format          Format to use for displaying report (json, html).
--filename        Specify the output filename.
--help            Show this message.
```

### Configuration File

The tool prioritizes CLI arguments but falls back to `css-audit.config.js` if present.

```javascript
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
```

## 📊 Generating HTML Reports

To generate a visual HTML report (like the one hosted on GitHub Pages), use the `--format=html` option.

```bash
# Generate report for wp-admin from trunk
npm run css-audit -- trunk/admin/* --format=html --all --filename=wp-admin-report
```

This will output a `wp-admin-report.html` file in the `public/` directory.

## Available Audits

- `colors`
  - Number of unique colors — normalizes hex colors so that uppercase & lowercase are not counted twice
  - Number of unique colors (ignoring opacity)
  - List of all colors
  - Top 10 most-used colors
  - Top 10 least-used colors
- `important`
  - Number of times `!important` is used
  - Top properties that use !important
- `property-values` — needs a list of properties to inspect.
  - Usage: `--property-values=[properties]`. For example: `--property-values=display`, or `--property-values=padding,margin`
  - Number of unique values for [property]
  - Top 10 most-used values for [property]
  - Top 10 least-used values for [property]
- `selectors`
  - Total number of selectors
  - Number of selectors with IDs — not "number of IDs", a lot of selectors use multiple IDs, but they'd only be counted once
  - Top 10 selectors with the highest specificity
  - Top 10 selectors by length
- `display-none`
  - Number of times `display: none` is used
  - Places where `display: none` is used
- `typography`
  - A collection of information about various typography-related properties

## Contributing to WordPress

This project follows WordPress coding standards and contribution guidelines. We welcome contributions from the community!

### Getting Started

Please refer to the [WordPress Developer Resources](https://developer.wordpress.org/) and [WordPress JavaScript Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/javascript/).
You can also join the [#core-css channel](https://wordpress.slack.com/archives/C02RP4T41) on [WordPress Slack](https://make.wordpress.org/chat/).

### Development

1.  Fork and clone the repository.
2.  Run `npm install`.
3.  Run `npm test` to execute tests.
4.  Run `npm run lint:js` and `npm run format:js` to check and format code.

If you find a bug, please [open an issue](https://github.com/WordPress/css-audit/issues) on GitHub.

## WordPress Resources

- [WordPress Core Handbook](https://make.wordpress.org/core/handbook/)
- [WordPress CSS Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/css/)
- [WordPress Design Handbook](https://make.wordpress.org/design/handbook/)
- [WordPress Core CSS Trac](https://core.trac.wordpress.org/query?component=CSS) - Track CSS-related tickets
- [Make WordPress Core Blog](https://make.wordpress.org/core/) - Stay updated on WordPress development

## Technical details

This tool parses each CSS file and creates an AST, which the audits traverse to pull out data. It uses [`postcss`](https://postcss.org/) for most audits, but [`csstree`](https://github.com/csstree/csstree) for the `media-queries` audit. PostCSS gives us the plugins ecosystem so that we can use `postcss-values-parser`, while csstree generates a much more detailed AST that robustly identifies media queries.

- [PostCSS API documentation](https://postcss.org/api/)
- [csstree documentation](https://github.com/csstree/csstree/tree/master/docs)
- [AST Explorer](https://astexplorer.net/) — great tool for identifying how the CSS is parsed.

## License

This project is licensed under GPL-2.0-or-later, consistent with WordPress core licensing.


