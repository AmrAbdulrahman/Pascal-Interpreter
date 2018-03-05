import { interpret } from './common/interpret';

describe('Interpreter:While', () => {
  it('while with a statement', async() => {
    const retuenValue = await interpret(`
      create n = 0

      while n less than 5
        n = n + 1

      return n
    `);

    expect(retuenValue).toEqual(5);
  });

  it('while with block', async() => {
    const retuenValue = await interpret(`
      create n = 0

      while n less than 5 {
        n = n + 1
        n = n + 1
      }

      return n
    `);

    expect(retuenValue).toEqual(6);
  });

  it('while...repeat', async() => {
    const retuenValue = await interpret(`
      create n = 0

      while n less than 5 repeat
        n = n + 1

      return n
    `);

    expect(retuenValue).toEqual(5);
  });

  it('while...do', async() => {
    const retuenValue = await interpret(`
      create n = 0

      while n less than 5 do
        n = n + 1

      return n
    `);

    expect(retuenValue).toEqual(5);
  });

  it('while without (repeat|do)', async() => {
    const retuenValue = await interpret(`
      create n = 0

      while n less than or equal 5
        n = n + 1

      return n
    `);

    expect(retuenValue).toEqual(6);
  });

  it('nested while loop', async() => {
    const retuenValue = await interpret(`
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

  it('while loop returns if it contains a return statement', async() => {
    const retuenValue = await interpret(`
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

  it('(continue) inside while loop', async() => {
    const retuenValue = await interpret(`
      function count135 {
        create n = 1,
               res = 0

        while n less than or equal 5 repeat {
          n = n + 1

          if n equals 2 or n equals 4 then
            continue // skip whatever left in the closest loop block

          res = res + 1
        }

        return res
      }

      return count135()
    `);

    expect(retuenValue).toEqual(3);
  });

  it('(break) inside while loop', async() => {
    const retuenValue = await interpret(`
      function breakOn takes br {
        create n = 1,
               max = 10

        while n less than or equal max repeat {
          if n equals br then break
          n = n + 1 // inc
        }

        return n
      }

      return breakOn(4)
    `);

    expect(retuenValue).toEqual(4);
  });
});
