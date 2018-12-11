analyze-cra-bundle
==================

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/analyze-cra-bundle.svg)](https://npmjs.org/package/analyze-cra-bundle)
[![Downloads/week](https://img.shields.io/npm/dw/analyze-cra-bundle.svg)](https://npmjs.org/package/analyze-cra-bundle)
[![License](https://img.shields.io/npm/l/analyze-cra-bundle.svg)](https://github.com/petecorreia/analyze-cra-bundle/blob/master/package.json)


### Keep an eye on your bundle size 📦

Assess impact of any code on the bundle size directly in your Pull Request changes 🔎

# Usage

```bash
$ analyze-cra-bundle
```

Generates a report at `.reports/build-analysis.json`. Check the file into git to track changes to bundle size when compared to latest master 🎉

<img width="435" src="media/screenshot-output.png" alt="Output screenshot">

Then it's easy to spot the diff in a Pull Request 👀

<img width="700" src="media/screenshot-PR.png" alt="Pull Request screenshot">

### Options:

```bash
$ analyze-cra-bundle --branch=master path/to/build/folder
```

