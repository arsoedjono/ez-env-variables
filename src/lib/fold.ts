import { FoldingRange, FoldingRangeKind, TextDocument, TextLine } from 'vscode';

export class Folder {
  private folds: FoldingRange[];

  constructor() {
    this.folds = [];
  }

  public start(doc: TextDocument): FoldingRange[] {
    for (let lineNumber = 0, startFoldLine = -1; lineNumber < doc.lineCount; lineNumber++) {
      const line = doc.lineAt(lineNumber);

      if (this.isValidFoldBreakLine(line)) {
        this.addFold(startFoldLine, lineNumber - 1);
        startFoldLine = this.isComment(line) ? lineNumber : -1;
      }
    }

    return this.folds;
  }

  private isComment(line: TextLine): boolean {
    return line.text[0] === '#'
  }

  private isValidFoldBreakLine(line: TextLine) {
    return this.isComment(line) || line.isEmptyOrWhitespace;
  }

  private addFold(start: number, end: number) {
    if (start < 0) {
      return;
    }

    this.folds.push(new FoldingRange(start, end, FoldingRangeKind.Region));
  }
}
