export enum Animal {
  Dog = 'dog',
  Cat = 'cat',
  Bird = 'bird',
}

export function assertNever(value: never): never {
  throw new Error('Unexpected value: ' + value);
}

export function feedAnimal(animal: Animal) {
  switch (animal) {
    case Animal.Dog:
      console.log('The dog eats meat');
      break;
    case Animal.Cat:
      console.log('The cat eats fish');
      break;
    case Animal.Bird:
      console.log('The bird eats seeds');
      break;
    default:
      assertNever(animal);
  }
}
