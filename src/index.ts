import { Command, flags } from '@oclif/command';
import * as fs from 'fs';
import * as gzipSize from 'gzip-size';
import * as execa from 'execa';
import chalk from 'chalk';

type Analysis = {
	size: number;
};

class AnalyzeCraBundle extends Command {
	static description = 'Analyzes your CRA bundle';

	static flags = {
		version: flags.version({ char: 'v' }),
		help: flags.help({ char: 'h' }),
		branch: flags.string({ char: 'b', default: 'master' }),
		buildFolder: flags.string({ char: 'f', default: 'build' }),
		outputFolder: flags.string({ char: 'o', default: '.analysis' }),
		outputFileName: flags.string({ char: 'n', default: 'size.json' }),
	};

	async run() {
		const {
			flags: {
				branch = 'master',
				buildFolder = 'build',
				outputFolder = '.analysis',
				outputFileName = 'size.json',
			},
		} = this.parse(AnalyzeCraBundle);

		this.log();
		this.log(chalk.magentaBright('Analyzing bundle... '));

		let indexFile;

		try {
			indexFile = fs.readFileSync(buildFolder + '/index.html', 'utf8');
		} catch {
			this.log();
			this.error(
				`Build folder '${buildFolder}' does not exist.\n\nMaybe tweak your build path?\nanalyze-cra-bundle path/to/build/folder`
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
			const gzippedSize = gzipSize.fileSync(buildFolder + f);
			const spaces = generateSpaces(Math.max(35 - f.length, 2));
			const filename = f.replace('/static/js/', '');
			this.log(
				`${chalk.gray('/static/js/')}${chalk.magentaBright(filename)}${spaces}${formatBytes(gzippedSize)}`
			);
			return t + gzippedSize;
		}, 0);

		const output = `${outputFolder}/${outputFileName}`;

		let previousAnalysis: Analysis;

		try {
			previousAnalysis = JSON.parse(await execa.stdout('git', ['cat-file', 'blob', `${branch}:${output}`]));
		} catch {
			this.log();
			this.log(chalk.magentaBright(`No previous analysis found in branch '${branch}'... first run?`));
			previousAnalysis = {
				size: 0,
			};
		}

		const diff = size - previousAnalysis.size;
		const diffPct = (diff / size) * 100;
		const color = diff > 0 ? 'red' : 'green';
		const diffFormatted = formatBytes(Math.abs(diff));
		const diffPretty = diff > 0 ? `+${diffFormatted}` : `-${diffFormatted}`;
		const diffPctFormatted = Math.abs(diffPct).toFixed(2);
		const diffPctPretty = diff > 0 ? `+${diffPctFormatted}%` : `-${diffPctFormatted}%`;

		this.log();
		this.log(`${chalk.bold(formatBytes(size))}  ${chalk[color](`${diffPretty} (${diffPctPretty})`)}`);

		const analysis: Analysis = {
			size,
		};

		if (!fs.existsSync(outputFolder)) {
			fs.mkdirSync(outputFolder);
		}
		fs.writeFileSync(output, JSON.stringify(analysis), 'utf8');

		this.log();
		this.log(
			chalk.magentaBright(
				chalk.bold.magentaBright('Bundle analysis completed! 🎉   ') + chalk.underline.magentaBright(output)
			)
		);

		this.exit();
	}
}

function formatBytes(bytes: number, decimals = 2): string {
	if (bytes === 0) return '0 Bytes';
	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

function generateSpaces(howMany: number) {
	return Array.from({ length: howMany }).reduce((acc, s) => acc + ' ', '');
}

export = AnalyzeCraBundle;
