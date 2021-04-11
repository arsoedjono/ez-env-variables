import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let formatEnv = vscode.languages.registerDocumentFormattingEditProvider('dotenv', {
		provideDocumentFormattingEdits(doc) {
			let edits: vscode.TextEdit[] = []

			for (let i = 0; i < doc.lineCount; i++) {
				let line = doc.lineAt(i)
				let range = line.range
				let text = line.text

				if (text.match(/^\s*\w+\s*:/m)) {
					let separatorIdx = text.indexOf(':')
					let key = text.substring(0, separatorIdx).trim()
					let value = text.substring(separatorIdx + 1).trim()

					edits.push(vscode.TextEdit.replace(range, `${key}=${value}`))
				} else if (line.firstNonWhitespaceCharacterIndex > 0 || text[text.length - 1] == ' ') {
					edits.push(vscode.TextEdit.replace(range, text.trim()))
				}
			}

			return edits
		}
	});

	context.subscriptions.push(formatEnv)
}

export function deactivate() {}
