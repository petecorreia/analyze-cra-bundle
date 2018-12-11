analyze-cra-bundle
==================

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/analyze-cra-bundle.svg)](https://npmjs.org/package/analyze-cra-bundle)
[![Downloads/week](https://img.shields.io/npm/dw/analyze-cra-bundle.svg)](https://npmjs.org/package/analyze-cra-bundle)
[![License](https://img.shields.io/npm/l/analyze-cra-bundle.svg)](https://github.com/petecorreia/analyze-cra-bundle/blob/master/package.json)


Analyzes your CRA build bundle stats 🚀

Useful for PRs and feature branches as it diffs gzipped bundle sizes with master branch.

# Usage

Assuming default CRA, just run at project root:

```
analyze-cra-bundle
```

This will generate a report in `.reports/build-analysis.json` which you should check into git to track changes to bundle size when compared to latest master 🎉

