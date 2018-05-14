export class Step {
  constructor({message, node, scope}) {
    this.message = message;
    this.node = node;
    this.scope = scope;
  }

  get from() {
    return this.node.from;
  }

  get to() {
    return this.node.to;
  }
}
