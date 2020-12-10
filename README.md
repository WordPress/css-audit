# CSS Audit

This is an experiment in using CSS parsers to … parse out information about a set of stylesheets. When run, it will generate information about your CSS, such as number of distinct colors used, most specific selectors, how many properties use `!important`, etc.

To run this yourself, download or clone this repo, then install the dependencies. You will need [node & npm](https://nodejs.org/en/) installed.

```
$ git clone git@github.com:ryelle/css-audit.git
$ cd css-audit
$ npm install
$ npm run css-audit
```

If you want to work on the audits yourself, [fork this repo](https://help.github.com/en/github/getting-started-with-github/fork-a-repo) to your account first. You can submit issues or PRs.

## Running Audits

To run the audits, you need a list of CSS files, and to indicate which audits you want to run. `yarn` and `npm` both automatically expand globs (`folder/*`), so you can use that, or pass in a list of CSS files. The audits are described below.

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

## Generating HTML Reports

To generate an HTML report, use the `--format=html` option and specify a name for the file with the `--filename=name` option. This will output a `{name}.html` file in public/ that is viewable on Github Pages.

For example, generating a report for wp-admin using the below strategy for pulling down CSS files from SVN:

```
npm run css-audit -- v5.5/**/* --format=html --all --filename=wp-admin
```

## Getting core CSS files

You can download the source files of CSS (not minified or RTL'd) from the svn repository. The following code will create a new directory, `v5.5`, and download just the files from each `css` folder.

```
mkdir v5.5
svn export https://develop.svn.wordpress.org/branches/5.5/src/wp-admin/css --depth files v5.5/admin
svn export https://develop.svn.wordpress.org/branches/5.5/src/wp-admin/css --depth files v5.5/includes
```

If you want to run this on trunk (code currently in development), you can swap out `branches/5.5` for `trunk`. You could also swap the `5.5` for `5.4`, etc. Example:

```
mkdir trunk
svn export https://develop.svn.wordpress.org/trunk/src/wp-admin/css --depth files trunk/admin
svn export https://develop.svn.wordpress.org/trunk/src/wp-admin/css --depth files trunk/includes
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

## Technical details

Uses [`csstree`](https://github.com/csstree/csstree) to parse each CSS file's contents. This creates an AST, which each audit traverses to pull out the data.

- [csstree's docs](https://github.com/csstree/csstree/tree/master/docs) are very good
- [AST Explorer](https://astexplorer.net/) — great tool for identifying how the CSS is parsed.

Use this command to get just the css files from SVN:

	svn export https://develop.svn.wordpress.org/trunk/src/wp-admin/css --depth files

For other version comparisons, `/trunk/` could be replaced with `/branches/5.3/`.

**Other notes…**

Initially this used the `postcss` parser, but that didn't generate enough information for the `selectors` audit.

Also explored using `CSSOM`, but it doesn't generate a true representation of the CSS content. Additional values overwrite the previous values (ex: fallbacks for background gradients). We need the parsed object to represent the CSS fully.
