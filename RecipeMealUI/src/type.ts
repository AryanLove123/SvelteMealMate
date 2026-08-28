export type RecipeSource = 'external' | 'community';

export interface UiRecipeSummary {
  id: string;
  source: RecipeSource;
  title: string;
  imageUrl?: string;
  category?: string;
  area?: string;
  createBy?: string;
}

export interface UiIngredient {
  name: string;
  measure?: string;
}

export interface UiRecipeFormValue {
  title: string;
  description?: string;
  imageUrl?: string;
  category: string;
  area?: string;
  ingredients: UiIngredient[];
  instructions: string;
}