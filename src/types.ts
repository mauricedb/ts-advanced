import { z } from 'zod';
import {
  extraIngredientSchema,
  extraIngredientsSchema,
  pizzaSchema,
} from './schemas';

export type Pizza = Readonly<z.infer<typeof pizzaSchema>>;

export type PizzaArray = ReadonlyArray<Pizza>;

export type ExtraIngredient = Readonly<z.infer<typeof extraIngredientSchema>>;

export type ExtraIngredients = Readonly<z.infer<typeof extraIngredientsSchema>>;

export interface ItemOrdered {
  name: string;
  price: number;
  extras: ExtraIngredient[];
}
