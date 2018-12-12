# analyze-cra-bundle

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/analyze-cra-bundle.svg)](https://npmjs.org/package/analyze-cra-bundle)
[![Downloads/week](https://img.shields.io/npm/dw/analyze-cra-bundle.svg)](https://npmjs.org/package/analyze-cra-bundle)
[![License](https://img.shields.io/npm/l/analyze-cra-bundle.svg)](https://github.com/petecorreia/analyze-cra-bundle/blob/master/package.json)

### Keep an eye on your Create React App bundle size 📦

Assess impact of new code/deps on the end-user initial bundle size and monitor it directly in your Pull Request changes via TravisCI. 🔎

It makes sure to track only CRA JS chunks present in index.html.

ℹ️ _This package is in its early stages. More features on the way. Suggestions welcome!_

# Installation

```bash
$ yarn add --dev analyze-cra-bundle
```

# Usage

```bash
$ analyze-cra-bundle

OPTIONS
  -f, --buildFolderPath=buildFolderPath  [default: build]
  -h, --help                             show help
  -v, --version                          show version
```

<img width="435" src="media/screenshot-output.png" alt="Output screenshot">

⚠️ **Warning**: Make sure to build your app before running the command: `yarn build && analyze-cra-bundle`

# TravisCI Integration

Keep an eye on the bundle size in your Pull Requests with a extra status check 👀

<img width="900" src="media/screenshot-PR.png" alt="Pull Request screenshot">

-   Add a Github Access Token as `ANALYZE_CRA_GITHUB_TOKEN` to your environment variables in the TravisCI project settings.
-   Add the script `"bundlesize": "analyze-cra-bundle"` to your `package.json` scripts
-   Add `  - yarn bundlesize` to your `.travis.yml` within `script:`

*(Create an issue if you're having trouble with this!)*
