import { z } from 'zod';

export const pizzaSchema = z.object({
  name: z.string().nonempty(),
  price: z.number().positive(),
  imageUrl: z.string(),
  imageCredit: z.string(),
  extras: z.array(z.string()),
});

export const pizzaArraySchema = z.array(pizzaSchema);

export const extraIngredientSchema = z.object({
  name: z.string().nonempty(),
  price: z.number().nonnegative(),
});

export const extraIngredientsSchema = z.record(extraIngredientSchema);
