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

export interface ItemOrdered {
  name: string;
  price: number;
  extras: ExtraIngredient[];
}
