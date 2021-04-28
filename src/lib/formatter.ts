import { TextDocument, TextEdit } from 'vscode';
import { row } from './row';

export class Formatter {
  private edits: TextEdit[];

  constructor() {
    this.edits = [];
  }

  public start(doc: TextDocument): TextEdit[] {
    for (let lineNumber = 0; lineNumber < doc.lineCount; lineNumber++) {
      const line = doc.lineAt(lineNumber);
      const text = line.text;

      if (this.isNeedToFormat(text)) {
        this.edits.push(TextEdit.replace(line.range, this.format(text)));
      }
    }

    return this.edits;
  }

  private isNeedToFormat(text: string): boolean {
    return text.match(/^(?:# (?:\S|\S.*\S)|\w+=(?:\S|\S.*\S|))$/m) === null;
  }

  private format(text: string): string {
    text = text.trim();

    if (row.isComment(text)) {
      return `# ${text.substring(1).trim()}`.trim();
    }

    const matcher = text.match(/^(\w+)\s*(:|=)\s*(.*)/m);

    if (matcher !== null) {
      matcher[2] = '=';
    }

    return matcher?.slice(1).join('') || text;
  }
}
