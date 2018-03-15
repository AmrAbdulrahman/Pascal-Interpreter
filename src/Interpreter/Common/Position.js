export class Position {
  constructor(row, col) {
    this.row = row;
    this.col = col;
  }

  valueOf() {
    return `[${this.row + 1}:${this.col + 1}]`;
  }
}
