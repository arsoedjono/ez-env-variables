import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
	const formatEnv = vscode.languages.registerDocumentFormattingEditProvider('dotenv', {
		provideDocumentFormattingEdits(doc) {
			let edits: vscode.TextEdit[] = []

			for (let i = 0; i < doc.lineCount; i++) {
				const line = doc.lineAt(i)
				let text = line.text

				if (text.match(/^(?:# (?:\S|\S.*\S)|\w+=(?:\S|\S.*\S|))$/m)) {
					continue
				}

				text = text.trim()
				text = formatCommentRow(text)
				text = formatEnvRow(text)

				edits.push(vscode.TextEdit.replace(line.range, text))
			}

			return edits
		}
	})

	const fold = vscode.languages.registerFoldingRangeProvider('dotenv', {
		provideFoldingRanges(doc) {
			const folds: vscode.FoldingRange[] = []
			let start = -1

			for (let i = 0; i < doc.lineCount; i++) {
				const line = doc.lineAt(i)
				const text = line.text

				if (text[0] === '#') {
					if (start >= 0) {
						folds.push(new vscode.FoldingRange(start, i - 1, vscode.FoldingRangeKind.Region))
					}
					start = i
				} else if (line.isEmptyOrWhitespace) {
					folds.push(new vscode.FoldingRange(start, i - 1, vscode.FoldingRangeKind.Region))
					start = -1
				}
			}

			return folds
		}
	})

	context.subscriptions.push(formatEnv)
}

export function formatCommentRow(text: string): string {
	if (text[0] !== '#') {
		return text
	}
	return `# ${text.substring(1).trim()}`.trim()
}

export function formatEnvRow(text: string): string {
	const matcher = text.match(/^\w+\s*(:|=)\s*/m)

	if (matcher === null) {
		return text
	}

	const separatorIdx = text.indexOf(matcher[1])
	const key = text.substring(0, separatorIdx).trim()
	const value = text.substring(separatorIdx + 1).trim()

	return `${key}=${value}`
}

export function deactivate() {}
