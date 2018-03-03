import { interpret } from './common/interpret';

describe('Interpreter:Repeat', () => {
  it('repeat with a number literal', () => {
    const retuenValue = interpret(`
      create n = 0

      repeat 5 times
        n = n + 1

      return n
    `);

    expect(retuenValue).toEqual(5);
  });

  it('repeat with a variable', () => {
    const retuenValue = interpret(`
      create n = 0,
             count = 5

      repeat count times
        n = n + 1

      return n
    `);

    expect(retuenValue).toEqual(5);
  });

  it('repeat with a block', () => {
    const retuenValue = interpret(`
      create n = 0,
             count = 5

      repeat count times {
        n = n + 1
        n = n + 1
      }

      return n
    `);

    expect(retuenValue).toEqual(10);
  });
});
