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
