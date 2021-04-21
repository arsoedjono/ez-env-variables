export class Row {
  private row: string;

  constructor(row: string) {
    this.row = row;
  }

  public format(): string {
    this.row = this.row.trim();
    this.formatComment()
      .formatVariable();

    return this.row;
  }

  public isFormatted(): boolean {
    return this.row.match(/^(?:# (?:\S|\S.*\S)|\w+=(?:\S|\S.*\S|))$/m) !== null;
  }

  private formatComment(): this {
    if (this.row[0] === '#') {
      this.row = `# ${this.row.substring(1).trim()}`.trim();
    }
    return this;
  }

  private formatVariable(): this {
    const matcher = this.row.match(/^\w+\s*(:|=)\s*/m);

    if (matcher !== null) {
      const separatorIdx = this.row.indexOf(matcher[1]);
      const key = this.row.substring(0, separatorIdx).trim();
      const value = this.row.substring(separatorIdx + 1).trim();

      this.row = `${key}=${value}`;
    }

    return this;
  }
}
