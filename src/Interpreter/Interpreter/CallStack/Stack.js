export class Stack {
  constructor() {
    this.items = [];
  }

  push(item) {
    return this.items.unshift(item);
  }

  pull() {
    return this.items.shift() || null;
  }
}
