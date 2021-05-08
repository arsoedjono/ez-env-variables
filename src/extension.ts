import { commands, ExtensionContext, languages, window } from 'vscode';
import { Folder } from './lib/fold';
import { Formatter } from './lib/formatter';
import { Linter } from './lib/linter';
import { valueFinder } from './lib/valueFinder';

export function activate(context: ExtensionContext) {
  const formatEnv = languages.registerDocumentFormattingEditProvider('dotenv', {
    provideDocumentFormattingEdits(doc) {
      return new Formatter().start(doc);
    }
  });

  const fold = languages.registerFoldingRangeProvider('dotenv', {
    provideFoldingRanges(doc) {
      return new Folder().start(doc);
    }
  });

  const findEnvValue = commands.registerCommand('ez-env-variables.findEnvValue', valueFinder);

  const diagnostic = languages.createDiagnosticCollection('dotenv');
  const linter = commands.registerCommand('ez-env-variables.linter', () => {
    const textEditor = window.activeTextEditor;
    if (textEditor) {
      new Linter(diagnostic).execute(textEditor.document);
    }
  });

  context.subscriptions.push(formatEnv, fold, findEnvValue, diagnostic, linter);
}

export function deactivate() { }
