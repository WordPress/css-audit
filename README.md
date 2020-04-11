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

## Available Audits

- `colors`
  - Number of unique colors
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
  - Number of selectors with IDs
  - Top 10 selectors with the highest specificity
  - Top 10 selectors by length

## Technical details



csstree -> very detailed, too much? can't pull out individual colors because all formats are separated out.

CSSOM

	Duplicate (fallback) properties are overwritten, so there can be only one (property, value) combo per selector. The later value overrides the previous.


postcss -> everyone already uses this one…

use this to get just CSS:

	svn export https://develop.svn.wordpress.org/trunk/src/wp-admin/css --depth files



--colors
--important
--property=[whatver,list]


