import { Command, flags } from '@oclif/command';
import * as fs from 'fs';
import * as gzipSize from 'gzip-size';
import * as execa from 'execa';
import chalk from 'chalk';
import { setStatus, generateSpaces, formatBytes } from './utils';

class AnalyzeCraBundle extends Command {
	static description = 'Analyzes your CRA bundle';

	static flags = {
		version: flags.version({ char: 'v' }),
		help: flags.help({ char: 'h' }),
		buildFolderPath: flags.string({ char: 'f', default: 'build' }),
	};

	async run() {
		const {
			flags: { buildFolderPath = 'build' },
		} = this.parse(AnalyzeCraBundle);

		this.log();
		this.log(chalk.magentaBright('Analyzing bundle... '));

		let indexFile;

		try {
			indexFile = fs.readFileSync(buildFolderPath + '/index.html', 'utf8');
		} catch {
			this.log();
			this.error(
				`Build folder '${buildFolderPath}' does not exist.\n\nMaybe tweak your build path?\nanalyze-cra-bundle path/to/build/folder`
			);
			return;
		}

		const fileMatches = indexFile.match(/src="\/static\/js.*?\.js"/gi);
		const files = (fileMatches && fileMatches.map(match => match.replace(/src="(.*)"$/, '$1'))) || [];

		if (!files || !files.length) {
			this.log();
			this.error(
				'No JS files found in build/static/js.\n\nMaybe tweak your build path?\nanalyze-cra-bundle path/to/build/folder'
			);
		}

		this.log();
		this.log(chalk.magentaBright('index.html:'));

		const size = files.reduce((t, f) => {
			// @ts-ignore - gzipSize is missing fileSync in its type but it exists
			const gzippedSize = gzipSize.fileSync(buildFolderPath + f);
			const spaces = generateSpaces(Math.max(35 - f.length, 2));
			const filename = f.replace('/static/js/', '');
			this.log(
				`${chalk.gray('/static/js/')}${chalk.magentaBright(filename)}${spaces}${formatBytes(gzippedSize)}`
			);
			return t + gzippedSize;
		}, 0);

		this.log();
		this.log(`${chalk.bold(formatBytes(size))}`);

		if (process.env.CI && process.env.TRAVIS) {
			this.log();
			this.log('Adding Github status check...');
			await setStatus({
				context: 'metrics/bundle-size',
				description: formatBytes(size),
				env: process.env as any,
				command: this,
			});
			this.log();
			this.log('Github status check added!');
		}

		this.log();
		this.log(chalk.magentaBright(chalk.bold.magentaBright('Bundle analysis completed! 🎉')));
		this.log();

		this.exit();
	}
}

export = AnalyzeCraBundle;
