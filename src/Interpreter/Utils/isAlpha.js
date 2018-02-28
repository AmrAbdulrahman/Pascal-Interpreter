export function isAlpha(char) {
  const ASCII = {
    A: 65,
    Z: 90,
    a: 97,
    z: 122,
  };

  const charCode = char.charCodeAt(0);

  return (charCode >= ASCII.A && charCode <= ASCII.Z) ||
         (charCode >= ASCII.a && charCode <= ASCII.z);
}
