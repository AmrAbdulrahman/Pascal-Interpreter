import { interpret } from './common/interpret';

describe('Interpreter:Return', () => {
  it('simple return statement works', () => {
    const retuenValue = interpret('return 1 + 2');
    expect(retuenValue).toEqual(3);
  });
});
