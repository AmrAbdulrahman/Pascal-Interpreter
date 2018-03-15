export class Step {
  constructor({message, node}) {
    this.message = message;
    this.node = node;
  }

  get from() {
    return this.node.from;
  }

  get to() {
    return this.node.to;
  }
}
