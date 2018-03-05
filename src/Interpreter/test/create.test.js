import { interpret } from './common/interpret';

describe('Interpreter:Create', () => {
  it('create variable in the global scope', async() => {
    await interpret(`create x`);
  });

  it('create variable with an initial value', async() => {
    const retuenValue = await interpret(`
      create num = 1,
             real = 1.2,
             str = 'single quoted',
             anotherStr = "double quoted"

      return num + real
    `);

    expect(retuenValue).toEqual(2.2);
  });

  it('create multiple variables in the same statement', async() => {
    const retuenValue = await interpret(`
      create x = 1, y = 2, z = 3, noVal
      return x + y + z
    `);

    expect(retuenValue).toEqual(6);
  });
});
