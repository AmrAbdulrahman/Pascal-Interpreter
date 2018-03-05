import { interpret } from './common/interpret';

describe('Interpreter:StepByStep', () => {
  it('step by step', async() => {
    const retuenValue = await interpret('return 1 + 2', { stepByStep: true});
    expect(retuenValue).toEqual(3);
  });
});
