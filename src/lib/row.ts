export namespace row {
  export function isComment(line: string): boolean {
    return line[0] === '#';
  }
}
