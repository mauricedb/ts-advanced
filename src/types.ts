import { z } from 'zod';
import {
  extraIngredientSchema,
  extraIngredientsSchema,
  pizzaSchema,
} from './schemas';

export type Pizza = z.infer<typeof pizzaSchema>;

export type PizzaArray = Pizza[];

export type ExtraIngredient = z.infer<typeof extraIngredientSchema>;

export type ExtraIngredients = z.infer<typeof extraIngredientsSchema>;

export interface ItemOrdered {
  name: string;
  price: number;
  extras: ExtraIngredient[];
}
