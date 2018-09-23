import rewire = require('rewire');

export function rewires(file: string,functions: string[]) {
  const rewirer = rewire(`../src/${file}`);

  return functions.map((name) => {
    return rewirer.__get__(name);
  })
}
