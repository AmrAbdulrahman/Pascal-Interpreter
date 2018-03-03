import { interpret } from './common/interpret';

describe('Interpreter:Object', () => {
  it('create object literal', () => {
    interpret(`
      create obj = {
        a: 1,
        b: 2
      }
    `);
  });

  it('object keys assigned with colon or equal sign', () => {
    interpret(`
      create obj = {
        a : 1,
        b = 2,
        c = 3,
      }
    `);
  });

  it('member access using (of)', () => {
    const returnValue = interpret(`
      create obj = {
        a : 1,
      }

      return a of obj
    `);

    expect(returnValue).toEqual(1);
  });

  it('member access using (dot)', () => {
    const returnValue = interpret(`
      create obj = {
        a : {
          b: 2
        }
      }

      return obj.a.b
    `);

    expect(returnValue).toEqual(2);
  });

  it('(of) has higher precedence than (dot)', () => {
    const returnValue = interpret(`
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
