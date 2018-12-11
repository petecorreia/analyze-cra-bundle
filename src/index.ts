import { Command, flags } from '@oclif/command';
import * as fs from 'fs';
import * as gzipSize from 'gzip-size';
import * as glob from 'glob';
import * as execa from 'execa';
import chalk from 'chalk';

type Analysis = {
	size: number;
	diff?: number;
	diffPct?: number;
};

class AnalyzeCraBundle extends Command {
	static description = 'Analyzes your CRA bundle';

	static flags = {
		version: flags.version({ char: 'v' }),
		help: flags.help({ char: 'h' }),
		branch: flags.string({ char: 'b', default: 'master' }),
	};

	static args = [{ name: 'pathToBuildFolder', default: 'build' }];

	async run() {
		const {
			args: { pathToBuildFolder },
			flags: { branch = 'master' },
		} = this.parse(AnalyzeCraBundle);

		this.log();
		this.log(chalk.magentaBright('Analyzing bundle... '));

		const outputFolder = '.reports';
		const outputFileName = 'build-analysis.json';
		const output = `${outputFolder}/${outputFileName}`;

		const files = glob.sync(pathToBuildFolder + '/static/js/*.js');

		if (!files || !files.length) {
			this.error(
				'No JS files found in build/static/js.\n\nMaybe tweak your build path?\nanalyze-cra-bundle path/to/build/folder'
			);
		}

		const size = files.reduce((t, f) => (t += (gzipSize as any).fileSync(f)), 0);

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

		const analysis: Analysis = {
			size,
			diff,
			diffPct,
		};

		if (!fs.existsSync(outputFolder)) {
			fs.mkdirSync(outputFolder);
		}
		fs.writeFileSync(output, JSON.stringify(analysis, null, 2), 'utf8');

		const color = diff > 0 ? 'red' : 'green';
		const diffFormatted = formatBytes(Math.abs(diff));
		const diffPretty = diff > 0 ? `+${diffFormatted}` : `-${diffFormatted}`;
		const diffPctFormatted = Math.abs(diffPct).toFixed(2);
		const diffPctPretty = diff > 0 ? `+${diffPctFormatted}%` : `-${diffPctFormatted}%`;

		this.log();
		this.log(
			chalk.magentaBright(
				chalk.bold.magentaBright('Bundle analysis completed! 🎉   ') + chalk.underline.magentaBright(output)
			)
		);

		this.exit();
	}
}

function formatBytes(bytes: number, decimals?: number): string {
	if (bytes === 0) return '0 Bytes';
	const k = 1024;
	const dm = !decimals || decimals <= 0 ? 0 : decimals || 2;
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export = AnalyzeCraBundle;
