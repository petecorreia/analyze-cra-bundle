import { Command, flags } from '@oclif/command';
import * as fs from 'fs';
import * as gzipSize from 'gzip-size';
import * as glob from 'glob';

class AnalyzeCraBundle extends Command {
	static description = 'Analyzes your CRA bundle';

	static flags = {
		version: flags.version({ char: 'v' }),
		help: flags.help({ char: 'h' }),
		output: flags.string({ char: 'o', default: 'build-analysis.json' }),
	};

	static args = [{ name: 'pathToBuildFolder', default: 'build' }];

	async run() {
		const {
			args: { pathToBuildFolder },
			flags: { output = 'build-analysis.json' },
		} = this.parse(AnalyzeCraBundle);

		if (!pathToBuildFolder) {
			this.error('No path to build folder specified specified. e.g. analyze-cra-bundle ./build');
		}

		let history: number[];

		try {
			const previousAnalysis = JSON.parse(fs.readFileSync(output, 'utf8'));
			history = previousAnalysis.history || [0];
		} catch {
			history = [0];
		}

		const files = glob.sync(pathToBuildFolder + '/static/js/*.js');

		if (!files || !files.length) {
			this.error('No JS files found in build/static/js');
		}

		const size = files.reduce((t, f) => (t += (gzipSize as any).fileSync(f)), 0);
		const previousSize = history[history.length - 1];
		const increase = size - previousSize;

		this.log(formatBytes(size));
		this.log(formatBytes(increase));

		fs.writeFileSync(output, JSON.stringify({ size, increase }, null, 2), 'utf8');

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
