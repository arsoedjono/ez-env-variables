import * as vscode from 'vscode';
import { Row } from './lib/row';

export function activate(context: vscode.ExtensionContext) {
  const formatEnv = vscode.languages.registerDocumentFormattingEditProvider('dotenv', {
    provideDocumentFormattingEdits(doc) {
      let edits: vscode.TextEdit[] = [];

      for (let i = 0; i < doc.lineCount; i++) {
        const line = doc.lineAt(i);
        let text = new Row(line.text);

        if (text.isFormatted()) {
          continue;
        }

        edits.push(vscode.TextEdit.replace(line.range, text.format()));
      }

      return edits;
    }
  });

  const fold = vscode.languages.registerFoldingRangeProvider('dotenv', {
    provideFoldingRanges(doc) {
      const folds: vscode.FoldingRange[] = [];

      for (let i = 0, start = -1; i < doc.lineCount; i++) {
        const line = doc.lineAt(i);
        const text = line.text;

        if (text[0] === '#') {
          if (start >= 0) {
            folds.push(new vscode.FoldingRange(start, i - 1, vscode.FoldingRangeKind.Region));
          }
          start = i;
        } else if (line.isEmptyOrWhitespace) {
          folds.push(new vscode.FoldingRange(start, i - 1, vscode.FoldingRangeKind.Region));
          start = -1;
        }
      }

      return folds;
    }
  });

  // TODO: add to right-click menu https://code.visualstudio.com/api/references/contribution-points#contributes.menus
  // TODO: tidy up code
  const findEnvValue = vscode.commands.registerCommand('ez-env-variables.findEnvValue', async () => {
    const envFileName = '/.env';
    const workspace = vscode.workspace.workspaceFolders;

    if (!workspace) {
      vscode.window.showErrorMessage('Must be in a workspace!');
      return;
    }

    const path = workspace[0].uri.path; // TODO: handle multiple workspaces
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      vscode.window.showErrorMessage('Must be in an open file!');
      return;
    }

    const selection = editor?.selection;
    if (selection.isEmpty || !selection.isSingleLine) {
      vscode.window.showErrorMessage('Select something in a single line!');
      return;
    }

    let doc;
    try {
      doc = await vscode.workspace.openTextDocument(path + envFileName);
    } catch (e) {
      vscode.window.showErrorMessage('No .env file found in the root project!');
      return;
    }

    const keyword = editor.document.getText(selection);
    const matcher = doc.getText().match(new RegExp(`^${keyword}=(.*)`, 'gm'));

    if (!matcher) {
      vscode.window.showErrorMessage(`ENV "${keyword}"not found!`);
      return;
    }

    const line = matcher[matcher.length - 1];
    const value = line.substring(line.indexOf('=') + 1);

    vscode.window.showInformationMessage(value);
  });

  context.subscriptions.push(formatEnv, fold, findEnvValue);
}

export function deactivate() { }
