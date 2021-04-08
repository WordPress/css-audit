# CSS Audit

This project contains an automated audit of the core WordPress CSS, including the number of distinct colors used, most specific selectors, how many properties use `!important`, and more. [View the audit report here.](https://ryelle.github.io/css-audit/public/wp-admin) This report is regenerated every day at 09:00 UTC, and runs over the latest CSS in [WordPress/wordpress-develop](https://github.com/WordPress/wordpress-develop/).

To generate this report, there is a tool `css-audit`, which runs a set of [audits](./src/audits).

## Local Environment

To run the audits yourself, download or clone this repo, then install the dependencies. You will need [node & npm](https://nodejs.org/en/) installed.

```
$ git clone git@github.com:ryelle/css-audit.git
$ cd css-audit
$ npm install
$ npm run css-audit -- <files...>
```

If you want to work on the audits yourself, [fork this repo](https://help.github.com/en/github/getting-started-with-github/fork-a-repo) to your account first. You can submit issues or PRs.

## Running Audits

To run the audits, you need a list of CSS files, and to indicate which audits you want to run. `yarn` and `npm` both automatically expand globs (`folder/*`), so you can use that, or pass in a list of CSS files. The audits are described below, and can be run via the following CLI args, or via configuration file (described in the next section).

```
$ npm run css-audit -- <files ...> [options]

Usage: css-audit -- <files...> [options]

--colors          Run colors audit.
--important       Run !important audit.
--display-none    Run display: none audit.
--selectors       Run selectors audit.
--media-queries   Run media queries audit.
--property-values Run audit for a given set of property values, comma-separated.
--recommended     Run recommended audits (colors, important, selectors). Default: true.
--all             Run all audits (except property values, as it requires a value).
--format          Format to use for displaying report.
--filename        If using a format that outputs to a file, specify the file name.
--help            Show this message.
```


### Configuration File

The program will prioritize configuration from CLI arguments, and will fallback to configuration stored in a file called `css-audit.config.js`.

```
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

## Generating HTML Reports

To generate an HTML report, use the `--format=html` option and specify a name for the file with the `--filename=name` option. This will output a `{name}.html` file in public/ that is viewable on Github Pages.

For example, generating a report for wp-admin using the below strategy for pulling down CSS files from SVN:

```
npm run css-audit -- v5.5/**/* --format=html --all --filename=wp-admin
```

In the configuration file, the argument `filename` can be added as a simple property: value combination, the same as `format` in the example. See the [default `css-audit.config.js`](./css-audit.config.js).

## Getting core CSS files

You can download the source files of CSS (not minified or RTL'd) from the svn repository. The following code will create a new directory, `v5.5`, and download just the files from each `css` folder.

```
mkdir v5.5
svn export https://develop.svn.wordpress.org/branches/5.5/src/wp-admin/css --depth files v5.5/admin
svn export https://develop.svn.wordpress.org/branches/5.5/src/wp-includes/css --depth files v5.5/includes
```

If you want to run this on trunk (code currently in development), you can swap out `branches/5.5` for `trunk`. You could also swap the `5.5` for `5.4`, etc. Example:

```
mkdir trunk
svn export https://develop.svn.wordpress.org/trunk/src/wp-admin/css --depth files trunk/admin
svn export https://develop.svn.wordpress.org/trunk/src/wp-includes/css --depth files trunk/includes
```

Now you can run the audits:

```
npm run css-audit -- v5.5/**/* --recommended
```

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

## Technical details

This tool parses each CSS file and creates an AST, which the audits traverse to pull out data. It uses [`postcss`](https://postcss.org/) for most audits, but [`csstree`](https://github.com/csstree/csstree) for the `media-queries` audit. PostCSS gives us the plugins ecosystem so that we can use `postcss-values-parser`, while csstree generates a much more detailed AST that robustly identifies media queries.

- [PostCSS API documentation](https://postcss.org/api/)
- [csstree documentation](https://github.com/csstree/csstree/tree/master/docs)
- [AST Explorer](https://astexplorer.net/) — great tool for identifying how the CSS is parsed.
