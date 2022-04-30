import { z } from 'zod';
import {
  extraIngredientSchema,
  extraIngredientsSchema,
  pizzaSchema,
} from './schemas';

type DeepReadonly<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};

export type Pizza = DeepReadonly<z.infer<typeof pizzaSchema>>;

export type PizzaArray = DeepReadonly<Pizza[]>;

export type ExtraIngredient = DeepReadonly<
  z.infer<typeof extraIngredientSchema>
>;

export type ExtraIngredients = DeepReadonly<
  z.infer<typeof extraIngredientsSchema>
>;

// export type ItemOrdered = Omit<Pizza, 'imageUrl' | 'imageCredit' | 'extras'> & {
//   extras: ExtraIngredient[];
// };

// Taken from https://effectivetypescript.com/2022/02/25/gentips-4-display/
type Resolve<T> = T extends Function ? T : { [K in keyof T]: T[K] };

export type ItemOrdered = Resolve<
  Pick<Pizza, 'name' | 'price'> & {
    readonly extras: ExtraIngredient[];
  }
>;

declare const _type: unique symbol;

type Opaque<A, B> = A & {
  readonly [_type]: B;
};

export type Amount = Opaque<number, 'Amount'>;
export type Account = Opaque<number, 'Account'>;

export function isAccount(value: unknown): value is Account {
  return typeof value === 'number' && value.toString().length === 10;
}

export function assertAccount(value: unknown): asserts value is Account {
  if (!isAccount(value)) {
    throw new Error(`Expected account, got ${value}`);
  }
}

export function assertAmount(value: unknown): asserts value is Amount {
  if (typeof value !== 'number') {
    throw new Error(`Expected amount, got ${value}`);
  }
}
