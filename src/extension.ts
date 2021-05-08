import { commands, ExtensionContext, languages, window, workspace } from 'vscode';
import { Folder } from './lib/fold';
import { Formatter } from './lib/formatter';
import { Linter } from './lib/linter';
import { valueFinder } from './lib/valueFinder';

export function activate(context: ExtensionContext) {
  const formatter = languages.registerDocumentFormattingEditProvider('dotenv', {
    provideDocumentFormattingEdits(doc) {
      return new Formatter().start(doc);
    }
  });
  context.subscriptions.push(formatter);

  const folder = languages.registerFoldingRangeProvider('dotenv', {
    provideFoldingRanges(doc) {
      return new Folder().start(doc);
    }
  });
  context.subscriptions.push(folder);

  const diagnostic = languages.createDiagnosticCollection('dotenv');
  context.subscriptions.push(diagnostic);

  const linter = new Linter(diagnostic);
  workspace.onDidOpenTextDocument((doc) => linter.execute(doc));
  workspace.onDidSaveTextDocument((doc) => linter.execute(doc));
  workspace.onDidCloseTextDocument((doc) => diagnostic.delete(doc.uri));

  const findCommand = commands.registerCommand('ez-env-variables.findCommand', valueFinder);
  const lintCommand = commands.registerCommand('ez-env-variables.lintCommand', () => linter.execute(window.activeTextEditor?.document));

  context.subscriptions.push(findCommand, lintCommand);
}

export function deactivate() { }
