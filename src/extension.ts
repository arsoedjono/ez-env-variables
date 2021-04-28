import * as vscode from 'vscode';
import { Folder } from './lib/fold';
import { Formatter } from './lib/formatter';

export function activate(context: vscode.ExtensionContext) {
  const formatEnv = vscode.languages.registerDocumentFormattingEditProvider('dotenv', {
    provideDocumentFormattingEdits(doc) {
      return new Formatter().start(doc);
    }
  });

  const fold = vscode.languages.registerFoldingRangeProvider('dotenv', {
    provideFoldingRanges(doc) {
      return new Folder().start(doc);
    }
  });

  // TODO: tidy up code
  const findEnvValue = vscode.commands.registerCommand('ez-env-variables.findEnvValue', async () => {
    const envFileName = '/.env';
    const workspace = vscode.workspace.workspaceFolders;

    if (!workspace) {
      vscode.window.showErrorMessage('Must be in a workspace!');
      return;
    }

    let index = 0;
    if (workspace.length > 1) {
      const names = workspace.map(ws => ws.name);
      const pick = await vscode.window.showQuickPick(names);

      if (pick) {
        index = names.indexOf(pick);

        if (index < 0) {
          index = 0;
          vscode.window.showWarningMessage(`Workspace ${pick} not found, find from ${workspace[0].name} instead!`);
        }
      }
    }

    const path = workspace[index].uri.path;
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
