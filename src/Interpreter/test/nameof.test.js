import { interpret } from './common/interpret';

describe('Interpreter:Nameof', () => {
  it('simple nameof', async() => {
    const returnValue = await interpret(`
      create x = 1
      return nameof x
    `);

    expect(returnValue).toEqual('x');
  });

  it('precedence', async() => {
    const returnValue = await interpret(`
      create y = +1
      create x = -1
      return nameof x + nameof y
    `);

    expect(returnValue).toEqual('xy');
  });
});
