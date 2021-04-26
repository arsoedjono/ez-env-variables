import { FoldingRange, FoldingRangeKind, TextDocument, TextLine } from 'vscode';

export class Fold {
  private folds: FoldingRange[];

  constructor() {
    this.folds = [];
  }

  public compile(doc: TextDocument): FoldingRange[] {
    for (let lineNumber = 0, startFoldLine = -1; lineNumber < doc.lineCount; lineNumber++) {
      const line = doc.lineAt(lineNumber);

      if (this.isValidFoldBreakLine(line)) {
        this.addFold(startFoldLine, lineNumber - 1);
        startFoldLine = this.isCommentLine(line) ? lineNumber : -1;
      }
    }

    return this.folds;
  }

  private isValidFoldBreakLine(line: TextLine) {
    return this.isCommentLine(line) || line.isEmptyOrWhitespace;
  }

  private isCommentLine(line: TextLine) {
    return line.text[0] === '#';
  }

  private addFold(start: number, end: number) {
    if (start < 0) return;

    this.folds.push(new FoldingRange(start, end, FoldingRangeKind.Region));
  }
}
