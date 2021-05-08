import { commands, ExtensionContext, languages } from 'vscode';
import { Folder } from './lib/fold';
import { Formatter } from './lib/formatter';
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

  context.subscriptions.push(formatEnv, fold, findEnvValue);
}

export function deactivate() { }
