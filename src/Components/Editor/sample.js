export default `
create x, c, s, cs

function square takes (n) {
   create res
   create real1
   res := n * n
   return res
}

print(square(4))

if 2 less than or equal 1
OR 10 greater than or equal 20 then {
  print('fulfills')

} and if 2 equals 2 then {
  print('elif')

} otherwise {
  print('fails')
}

function factorial takes(n) {
  if n equals 0
    then return 1
  otherwise
    return n * factorial(n - 1)
}

// return expression on the fly
// procedure cube(n : integer);
// begin
//  return n * n * n;
// end;

/*
function that calls a function
procedure compose(n : integer);
begin
 return square(n) + cube(n);
end;
*/

function sayHello takes name, title {
	print('hello', title, name)
}

sayHello('hanaa', 'mrs')
sayHello('amr', 'mr')


if 0 then
  print('true amr hehe :D')
and if 1 equals 2 then
  print('else if works!')
otherwise
  print('false value found!')

// x := 2;
// c := cube(x);
// s := square(x);
//cs := compose(x);

// argument as expression => function invokation
// print('x =>', x, ' | sqr =>', s, ' | cube =>', c, ' | compose() =>', compose(x));
// print('single quoted string');
// print("double quoted string");
// print(conditionalProcedure(1));

// print('ss', s);

return factorial(5)
`;
