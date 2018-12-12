# analyze-cra-bundle

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/analyze-cra-bundle.svg)](https://npmjs.org/package/analyze-cra-bundle)
[![Downloads/week](https://img.shields.io/npm/dw/analyze-cra-bundle.svg)](https://npmjs.org/package/analyze-cra-bundle)
[![License](https://img.shields.io/npm/l/analyze-cra-bundle.svg)](https://github.com/petecorreia/analyze-cra-bundle/blob/master/package.json)

### Keep an eye on your Create React App bundle size 📦

Assess impact of new code/deps on the end-user initial bundle size directly in your Pull Request changes. 🔎

_This package is in its early stages. More features on the way. Suggestions welcome!_

# Installation

```bash
$ yarn add --dev analyze-cra-bundle
```

# Usage

```bash
$ analyze-cra-bundle

OPTIONS
  -b, --branch=branch                  [default: master]
  -f, --buildFolder=buildFolder        [default: build]
  -o, --outputFolder=outputFolder      [default: .analysis]
  -n, --outputFileName=outputFileName  [default: size.json]
  -h, --help                           show help
  -v, --version                        show version
```

Generates a report at `.analysis/size.json`. Check the file into git to track changes to bundle size when compared to latest master. 🎉

<img width="435" src="media/screenshot-output.png" alt="Output screenshot">

Then it's easy to spot the diff in a Pull Request. 👀

<img width="700" src="media/screenshot-PR.png" alt="Pull Request screenshot">

Here's an [example](.analysis/size.json).

⚠️ **Warning**: Make sure to build your app before running the command: `yarn build`
