import { interpret } from './common/interpret';

describe('Interpreter:Repeat', () => {
  it('repeat with a number literal', async() => {
    const retuenValue = await interpret(`
      create n = 0

      repeat 5 times
        n = n + 1

      return n
    `);

    expect(retuenValue).toEqual(5);
  });

  it('repeat with a variable', async() => {
    const retuenValue = await interpret(`
      create n = 0,
             count = 5

      repeat count times
        n = n + 1

      return n
    `);

    expect(retuenValue).toEqual(5);
  });

  it('repeat with a chain', async() => {
    const retuenValue = await interpret(`
      create n = 0,
             obj = {
               count = 5
             }

      repeat obj.count times
        n = n + 1

      return n
    `);

    expect(retuenValue).toEqual(5);
  });

  it('repeat with a block', async() => {
    const retuenValue = await interpret(`
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

  it('nested repeat loop', async() => {
    const retuenValue = await interpret(`
      create res = 0,
             count = 10

      repeat count times
        repeat count times
          res = res + 1

      return res
    `);

    expect(retuenValue).toEqual(100);
  });

  it('repeat with break', async() => {
    const retuenValue = await interpret(`
      create i = 0

      repeat 10 times {
        i = i + 1

        if i equals 5 then return i
      }
    `);

    expect(retuenValue).toEqual(5);
  });

  it('break only breaks inner loop', async() => {
    const retuenValue = await interpret(`
      create i = 0

      repeat 10 times {
        create j = 0

        repeat 10 times {
          i = i + 1
          j = j + 1

          if j equals 5 then break
        }
      }

      return i
    `);

    expect(retuenValue).toEqual(50);
  });
});
