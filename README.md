analyze-cra-bundle
==================

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/analyze-cra-bundle.svg)](https://npmjs.org/package/analyze-cra-bundle)
[![Downloads/week](https://img.shields.io/npm/dw/analyze-cra-bundle.svg)](https://npmjs.org/package/analyze-cra-bundle)
[![License](https://img.shields.io/npm/l/analyze-cra-bundle.svg)](https://github.com/petecorreia/analyze-cra-bundle/blob/master/package.json)


Analyzes your Create React App bundle 🚀

This differs from similar tools as it makes use of versioning to assess code impact on bundle in your Pull Requests 🔎


# Usage

Just run this is your CRA project:

```bash
$ analyze-cra-bundle
```

This will generate a report in `.reports/build-analysis.json` which you should definitely check into git to track changes to bundle size when compared to latest master 🎉

Options (in case you need them):

```bash
// --branch — branch to compare. defaults to `master`
// arg — build path. defaults to `build`

$ analyze-cra-bundle --branch=master build
```

