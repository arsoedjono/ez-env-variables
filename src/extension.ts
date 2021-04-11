import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let formatEnv = vscode.languages.registerDocumentFormattingEditProvider('dotenv', {
		provideDocumentFormattingEdits(doc) {
			let edits: vscode.TextEdit[] = [];

			for (let i = 0; i < doc.lineCount; i++) {
				let line = doc.lineAt(i);
				let start = line.firstNonWhitespaceCharacterIndex

				// trim leading whitespace
				if (start != 0) {
					edits.push(vscode.TextEdit.delete(new vscode.Range(i, 0, i, start)));
				}
			}

			return edits;
		}
	});

	context.subscriptions.push(formatEnv);
}

export function deactivate() {}
