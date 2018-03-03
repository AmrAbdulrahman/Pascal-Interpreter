import { interpret } from './common/interpret';

describe('Interpreter:Comments', () => {
  it('line comment', () => {
    const retuenValue = interpret(`
      create x = 1 // a comment here
      // another comment here
      // return x
      return x + 1
    `);

    expect(retuenValue).toEqual(2);
  });

  it('block comment', () => {
    const retuenValue = interpret(`
      create /* a block comment inline */x = 1 // a line comment here
      /* another block comment
      return x
      */
      
      return x + 1
    `);

    expect(retuenValue).toEqual(2);
  });
});
