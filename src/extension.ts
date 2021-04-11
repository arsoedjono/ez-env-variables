import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let formatEnv = vscode.languages.registerDocumentFormattingEditProvider('ez-env-variables', {
		provideDocumentFormattingEdits(doc) {
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

	context.subscriptions.push(formatEnv);
}

export function deactivate() {}
