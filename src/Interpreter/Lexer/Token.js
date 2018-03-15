import { Position } from '../Common/Position';

export class Token {
  constructor(type, value, pos) {
    this.type = type;
    this.value = value;
    this.pos = pos;
  }

  toString() {
    return `Token(${this.type}, ${this.value})`;
  }

  getLocation() {
    return `(${this.pos.row + 1}:${this.pos.col + 1})`;
  }

  repr() {
    return this.toString();
  }

  is(...types) {
    return types.indexOf(this.type) !== -1;
  }

  get from() {
    return this.pos;
  }

  get to() {
    return new Position(this.from.row, this.from.col + this.value.toString().length);
  }
}
