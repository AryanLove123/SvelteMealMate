import type { RecipeSource, RecipeSummary } from "./recipe.model.ts";

export const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
export type WeekDay = (typeof WEEK_DAYS)[number];

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface MealPlanEntry{
    id: string;
    recipeId: string;
    source: RecipeSource;
    day: WeekDay;
    mealType: MealType;
    weekStart: string;
    createdAt: string;
    updatedAt: string; 
    recipe: RecipeSummary | null;
}