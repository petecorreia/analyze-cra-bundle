import { Command, flags } from '@oclif/command';
import * as fs from 'fs';
import * as gzipSize from 'gzip-size';
import * as glob from 'glob';
import * as execa from 'execa';

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

		const outputFolder = '.reports';
		const outputFileName = 'build-analysis.json';
		const output = `${outputFolder}/${outputFileName}`;

		if (!pathToBuildFolder) {
			this.error('No path to build folder specified specified. e.g. analyze-cra-bundle ./build');
		}

		const files = glob.sync(pathToBuildFolder + '/static/js/*.js');

		if (!files || !files.length) {
			this.error('No JS files found in build/static/js');
		}

		const size = files.reduce((t, f) => (t += (gzipSize as any).fileSync(f)), 0);

		let previousAnalysis: Analysis;

		try {
			previousAnalysis = JSON.parse(await execa.stdout('git', ['cat-file', 'blob', `${branch}:${output}`]));
		} catch {
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

		this.log(analysis as any);

		if (!fs.existsSync(outputFolder)) {
			fs.mkdirSync(outputFolder);
		}
		fs.writeFileSync(output, JSON.stringify(analysis, null, 2), 'utf8');

		this.exit();
	}
}

export = AnalyzeCraBundle;
