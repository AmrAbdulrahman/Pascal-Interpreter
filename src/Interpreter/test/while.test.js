import { interpret } from './common/interpret';

describe('Interpreter:While', () => {
  it('while with a statement', () => {
    const retuenValue = interpret(`
      create n = 0

      while n less than 5
        n = n + 1

      return n
    `);

    expect(retuenValue).toEqual(5);
  });

  it('while with block', () => {
    const retuenValue = interpret(`
      create n = 0

      while n less than 5 {
        n = n + 1
        n = n + 1
      }

      return n
    `);

    expect(retuenValue).toEqual(6);
  });

  it('while...repeat', () => {
    const retuenValue = interpret(`
      create n = 0

      while n less than 5 repeat
        n = n + 1

      return n
    `);

    expect(retuenValue).toEqual(5);
  });

  it('while...do', () => {
    const retuenValue = interpret(`
      create n = 0

      while n less than 5 do
        n = n + 1

      return n
    `);

    expect(retuenValue).toEqual(5);
  });

  it('while without (repeat|do)', () => {
    const retuenValue = interpret(`
      create n = 0

      while n less than or equal 5
        n = n + 1

      return n
    `);

    expect(retuenValue).toEqual(6);
  });

  it('nested while loop', () => {
    const retuenValue = interpret(`
      create i = 0,
             res = 0,
             count = 10

      while i less than count {
        create j = 0

        while j less than count {
          res = res + 1
          j = j + 1
        }

        i = i + 1
      }

      return res
    `);

    expect(retuenValue).toEqual(100);
  });

  it('while loop returns if it contains a return statement', () => {
    const retuenValue = interpret(`
      function foo {
        create n = 0

        while n less than or equal 5 repeat {
          return 'return' // terminates foo immediately
          n = n + 1
        }

        return 'unreachable'
      }

      return foo()
    `);

    expect(retuenValue).toEqual('return');
  });
});
