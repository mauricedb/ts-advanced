export interface Pizza {
  name: string;
  price: number;
  imageUrl: string;
  imageCredit: string;
  extras: string[];
}

export type PizzaArray = Pizza[];
export interface ExtraIngredients {
  [key: string]: ExtraIngredient;
}

export interface ExtraIngredient {
  name: string;
  price: number;
}

export interface ItemOrdered {
  name: string;
  price: number;
  extras: ExtraIngredient[];
}
