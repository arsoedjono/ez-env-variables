import * as vscode from 'vscode';

export class Logger {
	constructor(readonly output: vscode.OutputChannel) {
		this.output = output
	}

	log(msg: string) {
		let timestamp = new Date().toISOString().replace(/[a-zA-Z]/g, ' ').trim()
		this.output.appendLine(`[${timestamp}] ${msg}`);
	}

	dispose() {
		this.output.dispose();
	}
}

export function activate(context: vscode.ExtensionContext) {
	let logger = new Logger(vscode.window.createOutputChannel('EZ Env Variables'));
	logger.log('starting extension');

	let formatEnv = vscode.languages.registerDocumentFormattingEditProvider('ez-env-variables', {
		provideDocumentFormattingEdits(doc) {
			logger.log(`formatting ${doc.fileName}`)

			let edits: vscode.TextEdit[] = [];

			for (let i = 0; i < doc.lineCount; i++) {
				let line = doc.lineAt(i);

				if (line.isEmptyOrWhitespace && line.text.length > 0) {
					edits.push(vscode.TextEdit.delete(line.range));
				}
			}

			return edits;
		}
	});

	context.subscriptions.push(logger, formatEnv);
}

export function deactivate() {}
