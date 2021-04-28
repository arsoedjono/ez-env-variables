import { FoldingRange, FoldingRangeKind, TextDocument, TextLine } from 'vscode';
import { row } from './row';

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
        startFoldLine = row.isComment(line.text) ? lineNumber : -1;
      }
    }

    return this.folds;
  }

  private isValidFoldBreakLine(line: TextLine) {
    return row.isComment(line.text) || line.isEmptyOrWhitespace;
  }

  private addFold(start: number, end: number) {
    if (start < 0) {
      return;
    }

    this.folds.push(new FoldingRange(start, end, FoldingRangeKind.Region));
  }
}
