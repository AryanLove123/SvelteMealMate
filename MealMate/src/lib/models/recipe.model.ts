export type RecipeSource = 'external' | 'community';

export interface Ingredient {
  name: string;
  measure?: string;
}

export interface Recipe {
  id: string;
  source: RecipeSource;
  title: string;
  description?: string;
  imageUrl?: string;
  area?: string;
  category?: string;
  ingredients: Ingredient[];
  instructions: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type RecipeSummary = Pick<
  Recipe,
  'id' | 'source' | 'title' | 'imageUrl' | 'category' | 'area' | 'createdBy'
>;