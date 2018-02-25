export default `
create a = 12,
       b = a + 1

print('a is', a, 'and b is', b)

function square takes n {
  create res = n * n
  return res
}

create obj = {
  a: 3,
  s: square(a),
  c: {
    z: 1
  }
}

print('obj is', obj)
print('s of obj', z of c of obj)

if 2 less than or equal 1
OR 10 greater than or equal 20 then {
  print('fulfills')

} and if 2 equals 2 then {
  print('elif')

} otherwise {
  print('fails')
}

function factorial takes n {
  if n equals 0 then return 1
  otherwise return n * factorial(n - 1)
}

// line comment

/*
block comment
block comment
block comment
*/

function printWelcomeMessage {
	print('Herzlisch welkommen')
}

printWelcomeMessage()

function sayHello takes title, name {
	print('hello', title, name)
}

sayHello('mrs', 'hanaa')
sayHello('mr', 'amr')

return factorial(5)
`;
