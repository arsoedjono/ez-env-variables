import { Diagnostic, DiagnosticCollection, DiagnosticSeverity, Range, TextDocument } from 'vscode';

export class Linter {
  private diagnostics: DiagnosticCollection;

  constructor(diagnostics: DiagnosticCollection) {
    this.diagnostics = diagnostics;
  }

  public execute(doc: TextDocument) {
    if (doc.languageId !== 'dotenv') {
      return;
    }

    const variables = new Map<string, Array<number>>();

    for (let lineNumber = 0; lineNumber < doc.lineCount; lineNumber++) {
      const line = doc.lineAt(lineNumber);
      const matcher = line.text.match(/^\s*(\w*)\s*=.*$/);

      if (matcher === null) {
        continue;
      }

      const variable = matcher[1];
      const value = variables.get(variable);

      if (value) {
        value.push(lineNumber);
      } else {
        variables.set(variable, [lineNumber]);
      }
    }

    const entries: Diagnostic[] = [];
    variables.forEach((value, key) => {
      if (value.length > 1) {
        value.forEach((lineNumber) => {
          const index = doc.lineAt(lineNumber).text.indexOf(key);
          const range = new Range(lineNumber, index, lineNumber, key.length);
          const diagnostic = new Diagnostic(range, 'duplicate key', DiagnosticSeverity.Warning);
          entries.push(diagnostic);
        });
      }
    });

    this.diagnostics.set(doc.uri, entries);
  }
}
