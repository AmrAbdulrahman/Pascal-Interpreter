import { interpret } from './common/interpret';

describe('Interpreter:Object', () => {
  it('create object literal', async() => {
    await interpret(`
      create obj = {
        a: 1,
        b: 2
      }
    `);
  });

  it('object keys assigned with colon or equal sign', async() => {
    await interpret(`
      create obj = {
        a : 1,
        b = 2,
        c = 3,
      }
    `);
  });

  it('member access using (of)', async() => {
    const returnValue = await interpret(`
      create obj = {
        a : 1,
      }

      return a of obj
    `);

    expect(returnValue).toEqual(1);
  });

  it('member access using (dot)', async() => {
    const returnValue = await interpret(`
      create obj = {
        a : {
          b: 2
        }
      }

      return obj.a.b
    `);

    expect(returnValue).toEqual(2);
  });

  it('(of) has higher precedence than (dot)', async() => {
    const returnValue = await interpret(`
      create a = {
        b: {
          c: {
            d: 'value'
          }
        }
      }

      return d of a.b.c
    `);

    expect(returnValue).toEqual('value');
  });
});
