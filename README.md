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
$ yarn css-audit ./wp-admin/* --help
Usage: index.js <files...> [options]

Options:
  --help             Show help                                         [boolean]
  --version          Show version number                               [boolean]
  --colors           Run colors audit.
  --important        Run !important audit.
  --display-none     Run display: none audit.
  --selectors        Run selectors audit.
  --recommended      Run recommended audits (colors, important, selectors).
                                                                 [default: true]
  --all              Run all audits (except property values).
  --property-values  Run audit for a given set of property values, comma-separated.
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
- `property-values` — needs a list of properties to inspect, for example, display.
  - Number of unique values for display
  - Top 10 most-used values for display
  - Top 10 least-used values for display
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

For other version comparisons, `/trunk/` could be replaced with `/tags/5.3/`.

**Other notes…**

Initially this used the `postcss` parser, but that didn't generate enough information for the `selectors` audit.

Also explored using `CSSOM`, but it doesn't generate a true representation of the CSS content. Additional values overwrite the previous values (ex: fallbacks for background gradients). We need the parsed object to represent the CSS fully.
