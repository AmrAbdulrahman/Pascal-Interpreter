export default `
create a = 12,
       b = a + 1

print('a is', a, 'and b is', b)

function square takes n {
  create res = n * n
  return res
}

print('square of 4 is', square(4))

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
