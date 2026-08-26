export type RecipeSource = 'external' | 'community';

export interface UiRecipeSummary {
  id: string;
  source: RecipeSource;
  title: string;
  imageUrl?: string;
  category?: string;
  area?: string;
  authorName?: string;
}