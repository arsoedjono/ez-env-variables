import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let formatEnv = vscode.languages.registerDocumentFormattingEditProvider('dotenv', {
		provideDocumentFormattingEdits(doc) {
			let edits: vscode.TextEdit[] = []

			for (let i = 0; i < doc.lineCount; i++) {
				let line = doc.lineAt(i)
				let text = line.text

				if (text.match(/^(?:# (?:\S|\S.*\S)|\w+=(?:\S|\S.*\S|))$/m)) {
					continue
				}

				text = text.trim()

				if (text[0] === '#') {
					text = `# ${text.substring(1).trim()}`.trim()
				} else {
					let matcher = text.match(/^\w+\s*(:|=)\s*/m)
					if (matcher != null) {
						let separatorIdx = text.indexOf(matcher[1])
						let key = text.substring(0, separatorIdx).trim()
						let value = text.substring(separatorIdx + 1).trim()

						text = `${key}=${value}`
					}
				}
				edits.push(vscode.TextEdit.replace(line.range, text))
			}

			return edits
		}
	});

	context.subscriptions.push(formatEnv)
}

export function deactivate() {}
